package model

type TranslationPrompt struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Content   string `json:"content"`
	IsSystem  bool   `json:"is_system"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}

func (TranslationPrompt) TableName() string {
	return "translation_prompts"
}

type PromptCreateRequest struct {
	Name    string `json:"name" binding:"required"`
	Content string `json:"content" binding:"required"`
}

type PromptUpdateRequest struct {
	Name    string `json:"name"`
	Content string `json:"content"`
}

type PromptResponse struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Content   string `json:"content"`
	IsSystem  bool   `json:"is_system"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}

func (p *TranslationPrompt) ToResponse() PromptResponse {
	return PromptResponse{
		ID:        p.ID,
		Name:      p.Name,
		Content:   p.Content,
		IsSystem:  p.IsSystem,
		CreatedAt: p.CreatedAt,
		UpdatedAt: p.UpdatedAt,
	}
}
