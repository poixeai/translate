package service

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/its-rory/translate/backend/internal/model"
	"github.com/its-rory/translate/backend/internal/repository"
)

var upstreamHTTPClient = &http.Client{Timeout: 45 * time.Second}

type TranslateService struct {
	providerRepo *repository.ProviderRepository
	promptRepo   *repository.PromptRepository
}

func NewTranslateService() *TranslateService {
	return &TranslateService{
		providerRepo: repository.NewProviderRepository(),
		promptRepo:   repository.NewPromptRepository(),
	}
}

type TranslateRequest struct {
	ProviderID      int64  `json:"provider_id" binding:"required"`
	ModelName       string `json:"model_name" binding:"required"`
	PromptID        int64  `json:"prompt_id"`
	SourceText      string `json:"source_text" binding:"required"`
	TargetLang      string `json:"target_lang"`
	SourceLang      string `json:"source_lang"`
	TranslationMode string `json:"translation_mode"`
}

type TranslateResponse struct {
	TranslatedText string `json:"translated_text"`
}

type StreamTranslateRequest struct {
	ProviderID      int64  `json:"provider_id" binding:"required"`
	ModelName       string `json:"model_name" binding:"required"`
	PromptID        int64  `json:"prompt_id"`
	SourceText      string `json:"source_text" binding:"required"`
	TargetLang      string `json:"target_lang"`
	SourceLang      string `json:"source_lang"`
	TranslationMode string `json:"translation_mode"`
}

func (s *TranslateService) Translate(req TranslateRequest) (*TranslateResponse, error) {
	provider, promptContent, userMessage, err := s.prepareRequest(req.ProviderID, req.PromptID, req.SourceText, req.TargetLang, req.SourceLang, req.TranslationMode)
	if err != nil {
		return nil, err
	}

	switch provider.APIStyle {
	case "openai_completions":
		return s.translateOpenAICompletions(provider, req.ModelName, promptContent, userMessage)
	case "openai_responses":
		return s.translateOpenAIResponses(provider, req.ModelName, promptContent, userMessage)
	case "anthropic_messages":
		return s.translateAnthropicMessages(provider, req.ModelName, promptContent, userMessage)
	case "google_gemini_content":
		return s.translateGeminiContent(provider, req.ModelName, promptContent, userMessage)
	default:
		return nil, fmt.Errorf("unsupported API style: %s", provider.APIStyle)
	}
}

func (s *TranslateService) StreamTranslate(req StreamTranslateRequest, writer *bufio.Writer, flusher http.Flusher) error {
	provider, promptContent, userMessage, err := s.prepareRequest(req.ProviderID, req.PromptID, req.SourceText, req.TargetLang, req.SourceLang, req.TranslationMode)
	if err != nil {
		return err
	}

	switch provider.APIStyle {
	case "openai_completions":
		return s.streamOpenAICompletions(provider, req.ModelName, promptContent, userMessage, writer, flusher)
	default:
		return fmt.Errorf("streaming not supported for API style: %s", provider.APIStyle)
	}
}

func (s *TranslateService) prepareRequest(providerID, promptID int64, sourceText, targetLang, sourceLang, translationMode string) (*model.Provider, string, string, error) {
	provider, err := s.providerRepo.GetByID(providerID)
	if err != nil {
		return nil, "", "", fmt.Errorf("failed to get provider: %w", err)
	}
	if provider == nil {
		return nil, "", "", fmt.Errorf("provider not found")
	}

	promptContent := ""
	if promptID > 0 {
		prompt, err := s.promptRepo.GetByID(promptID)
		if err != nil {
			return nil, "", "", fmt.Errorf("failed to get prompt: %w", err)
		}
		if prompt != nil && prompt.Content != "" {
			promptContent = prompt.Content
		}
	}

	finalPrompt := buildTranslationPrompt(promptContent, sourceLang, targetLang, translationMode)

	return provider, finalPrompt, buildUserMessage(sourceText, sourceLang), nil
}

func buildTranslationPrompt(promptContent, sourceLang, targetLang, translationMode string) string {
	if translationMode == "zh_en_auto" {
		return promptContent + "\n" +
			"Translate between Chinese and English automatically.\n" +
			"If the user's input is Chinese, translate it into natural English.\n" +
			"If the user's input is English, translate it into natural Simplified Chinese.\n" +
			"Only output the translation result. Do not explain the detected language."
	}

	if sourceLang == "auto" || sourceLang == "" {
		return promptContent + "\n" +
			fmt.Sprintf("Detect the user's input language and translate it into %s.\n", targetLang) +
			"Only output the translation result."
	}

	return promptContent + "\n" +
		fmt.Sprintf("Translate the user's input from %s into %s.\n", sourceLang, targetLang) +
		"Only output the translation result."
}

func buildUserMessage(sourceText, sourceLang string) string {
	if sourceLang != "" && sourceLang != "auto" {
		return fmt.Sprintf("[Source language: %s]\n\n%s", sourceLang, sourceText)
	}
	return sourceText
}

func (s *TranslateService) translateOpenAICompletions(provider *model.Provider, modelName, systemPrompt, userMessage string) (*TranslateResponse, error) {
	result, err := s.doHTTPPost(strings.TrimRight(provider.BaseURL, "/")+"/v1/chat/completions", provider.APIKey, map[string]interface{}{
		"model": modelName,
		"messages": []map[string]string{
			{"role": "system", "content": systemPrompt},
			{"role": "user", "content": userMessage},
		},
		"stream": false,
	})
	if err != nil {
		return nil, err
	}

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return nil, fmt.Errorf("no choices in response")
	}
	choice, ok := choices[0].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid choice format")
	}
	message, ok := choice["message"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid message format")
	}
	content, _ := message["content"].(string)
	return &TranslateResponse{TranslatedText: content}, nil
}

func (s *TranslateService) translateOpenAIResponses(provider *model.Provider, modelName, systemPrompt, userMessage string) (*TranslateResponse, error) {
	result, err := s.doHTTPPost(strings.TrimRight(provider.BaseURL, "/")+"/v1/responses", provider.APIKey, map[string]interface{}{
		"model":        modelName,
		"instructions": systemPrompt,
		"input":        userMessage,
		"stream":       false,
	})
	if err != nil {
		return nil, err
	}

	output, ok := result["output"].([]interface{})
	if !ok || len(output) == 0 {
		return nil, fmt.Errorf("no output in response")
	}
	for _, item := range output {
		message, ok := item.(map[string]interface{})
		if !ok || message["type"] != "message" {
			continue
		}
		content, ok := message["content"].([]interface{})
		if !ok || len(content) == 0 {
			continue
		}
		textPart, ok := content[0].(map[string]interface{})
		if !ok {
			continue
		}
		text, _ := textPart["text"].(string)
		if text != "" {
			return &TranslateResponse{TranslatedText: text}, nil
		}
	}

	return nil, fmt.Errorf("no text content in response")
}

func (s *TranslateService) translateAnthropicMessages(provider *model.Provider, modelName, systemPrompt, userMessage string) (*TranslateResponse, error) {
	requestBody, err := json.Marshal(map[string]interface{}{
		"model":      modelName,
		"max_tokens": 4096,
		"system":     systemPrompt,
		"messages": []map[string]string{
			{"role": "user", "content": userMessage},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(context.Background(), http.MethodPost, strings.TrimRight(provider.BaseURL, "/")+"/v1/messages", bytes.NewReader(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-api-key", provider.APIKey)
	httpReq.Header.Set("anthropic-version", "2023-06-01")

	result, err := s.doHTTPRequest(httpReq)
	if err != nil {
		return nil, err
	}

	content, ok := result["content"].([]interface{})
	if !ok || len(content) == 0 {
		return nil, fmt.Errorf("no content in response")
	}
	textBlock, ok := content[0].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid content format")
	}
	text, _ := textBlock["text"].(string)
	if text == "" {
		return nil, fmt.Errorf("no text content in response")
	}
	return &TranslateResponse{TranslatedText: text}, nil
}

func (s *TranslateService) translateGeminiContent(provider *model.Provider, modelName, systemPrompt, userMessage string) (*TranslateResponse, error) {
	query := url.Values{}
	query.Set("key", provider.APIKey)
	endpoint := fmt.Sprintf("%s/v1beta/models/%s:generateContent?%s", strings.TrimRight(provider.BaseURL, "/"), url.PathEscape(modelName), query.Encode())

	result, err := s.doHTTPPostNoAuth(endpoint, map[string]interface{}{
		"system_instruction": map[string]interface{}{
			"parts": []map[string]string{{"text": systemPrompt}},
		},
		"contents": []map[string]interface{}{
			{"parts": []map[string]string{{"text": userMessage}}},
		},
	})
	if err != nil {
		return nil, err
	}

	candidates, ok := result["candidates"].([]interface{})
	if !ok || len(candidates) == 0 {
		return nil, fmt.Errorf("no candidates in response")
	}
	candidate, ok := candidates[0].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid candidate format")
	}
	content, ok := candidate["content"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid content format")
	}
	parts, ok := content["parts"].([]interface{})
	if !ok || len(parts) == 0 {
		return nil, fmt.Errorf("no parts in content")
	}
	part, ok := parts[0].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("invalid part format")
	}
	text, _ := part["text"].(string)
	if text == "" {
		return nil, fmt.Errorf("no text content in response")
	}
	return &TranslateResponse{TranslatedText: text}, nil
}

func (s *TranslateService) streamOpenAICompletions(provider *model.Provider, modelName, systemPrompt, userMessage string, writer *bufio.Writer, flusher http.Flusher) error {
	requestBody, err := json.Marshal(map[string]interface{}{
		"model": modelName,
		"messages": []map[string]string{
			{"role": "system", "content": systemPrompt},
			{"role": "user", "content": userMessage},
		},
		"stream": true,
	})
	if err != nil {
		return fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(context.Background(), http.MethodPost, strings.TrimRight(provider.BaseURL, "/")+"/v1/chat/completions", bytes.NewReader(requestBody))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+provider.APIKey)

	resp, err := upstreamHTTPClient.Do(httpReq)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, readErr := io.ReadAll(resp.Body)
		if readErr != nil {
			return fmt.Errorf("upstream API request failed with status %d", resp.StatusCode)
		}
		return sanitizeUpstreamError(resp.StatusCode, respBody)
	}

	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)

	for scanner.Scan() {
		line := scanner.Text()
		if !strings.HasPrefix(line, "data: ") {
			continue
		}

		data := strings.TrimPrefix(line, "data: ")
		if data == "[DONE]" {
			fmt.Fprint(writer, "data: [DONE]\n\n")
			writer.Flush()
			flusher.Flush()
			break
		}

		var chunk map[string]interface{}
		if err := json.Unmarshal([]byte(data), &chunk); err != nil {
			continue
		}

		choices, ok := chunk["choices"].([]interface{})
		if !ok || len(choices) == 0 {
			continue
		}
		choice, ok := choices[0].(map[string]interface{})
		if !ok {
			continue
		}
		delta, ok := choice["delta"].(map[string]interface{})
		if !ok {
			continue
		}
		content, _ := delta["content"].(string)
		if content == "" {
			continue
		}

		sseData, _ := json.Marshal(map[string]string{"content": content})
		fmt.Fprintf(writer, "data: %s\n\n", sseData)
		writer.Flush()
		flusher.Flush()
	}

	if err := scanner.Err(); err != nil {
		return fmt.Errorf("failed to read upstream stream: %w", err)
	}

	return nil
}

func (s *TranslateService) doHTTPPost(endpoint, apiKey string, body interface{}) (map[string]interface{}, error) {
	requestBody, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(context.Background(), http.MethodPost, endpoint, bytes.NewReader(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+apiKey)

	return s.doHTTPRequest(httpReq)
}

func (s *TranslateService) doHTTPPostNoAuth(endpoint string, body interface{}) (map[string]interface{}, error) {
	requestBody, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequestWithContext(context.Background(), http.MethodPost, endpoint, bytes.NewReader(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")

	return s.doHTTPRequest(httpReq)
}

func (s *TranslateService) doHTTPRequest(httpReq *http.Request) (map[string]interface{}, error) {
	resp, err := upstreamHTTPClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, sanitizeUpstreamError(resp.StatusCode, respBody)
	}

	var result map[string]interface{}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}
	return result, nil
}

func sanitizeUpstreamError(statusCode int, _ []byte) error {
	switch statusCode {
	case http.StatusUnauthorized, http.StatusForbidden:
		return fmt.Errorf("upstream API authentication failed")
	case http.StatusTooManyRequests:
		return fmt.Errorf("upstream API rate limit exceeded")
	case http.StatusBadGateway, http.StatusGatewayTimeout, http.StatusRequestTimeout:
		return fmt.Errorf("upstream API timed out")
	default:
		return fmt.Errorf("upstream API request failed with status %d", statusCode)
	}
}
