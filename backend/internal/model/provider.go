package model

type Provider struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	BaseURL   string `json:"base_url"`
	APIKey    string `json:"api_key"`
	APIStyle  string `json:"api_style"`
	Models    string `json:"models"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}

func (Provider) TableName() string {
	return "providers"
}

type ProviderCreateRequest struct {
	Name     string `json:"name" binding:"required"`
	BaseURL  string `json:"base_url" binding:"required,url"`
	APIKey   string `json:"api_key"`
	APIStyle string `json:"api_style" binding:"required,oneof=openai_completions openai_responses anthropic_messages google_gemini_content"`
	Models   string `json:"models"`
}

type ProviderUpdateRequest struct {
	Name     string `json:"name"`
	BaseURL  string `json:"base_url"`
	APIKey   string `json:"api_key"`
	APIStyle string `json:"api_style"`
	Models   string `json:"models"`
}

type ProviderResponse struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	BaseURL   string `json:"base_url"`
	APIKey    string `json:"api_key"`
	APIStyle  string `json:"api_style"`
	Models    string `json:"models"`
	CreatedAt int64  `json:"created_at"`
	UpdatedAt int64  `json:"updated_at"`
}

func (p *Provider) ToResponse() ProviderResponse {
	return ProviderResponse{
		ID:        p.ID,
		Name:      p.Name,
		BaseURL:   p.BaseURL,
		APIKey:    "",
		APIStyle:  p.APIStyle,
		Models:    p.Models,
		CreatedAt: p.CreatedAt,
		UpdatedAt: p.UpdatedAt,
	}
}
