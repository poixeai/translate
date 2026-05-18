package model

type UserPreference struct {
	ID                      int64  `json:"id"`
	UserID                  int64  `json:"user_id"`
	TranslationMode         string `json:"translation_mode"`
	SourceLanguage          string `json:"source_language"`
	TargetLanguage          string `json:"target_language"`
	SelectedModelProviderID *int64 `json:"selected_model_provider_id"`
	SelectedModelName       string `json:"selected_model_name"`
	SelectedPromptID        *int64 `json:"selected_prompt_id"`
	Theme                   string `json:"theme"`
	Locale                  string `json:"locale"`
	UpdatedAt               int64  `json:"updated_at"`
}

func (UserPreference) TableName() string {
	return "user_preferences"
}

type PreferenceUpdateRequest struct {
	TranslationMode         string `json:"translation_mode"`
	SourceLanguage          string `json:"source_language"`
	TargetLanguage          string `json:"target_language"`
	SelectedModelProviderID *int64 `json:"selected_model_provider_id"`
	SelectedModelName       string `json:"selected_model_name"`
	SelectedPromptID        *int64 `json:"selected_prompt_id"`
	Theme                   string `json:"theme"`
	Locale                  string `json:"locale"`
}

type PreferenceResponse struct {
	ID                      int64  `json:"id"`
	UserID                  int64  `json:"user_id"`
	TranslationMode         string `json:"translation_mode"`
	SourceLanguage          string `json:"source_language"`
	TargetLanguage          string `json:"target_language"`
	SelectedModelProviderID *int64 `json:"selected_model_provider_id"`
	SelectedModelName       string `json:"selected_model_name"`
	SelectedPromptID        *int64 `json:"selected_prompt_id"`
	Theme                   string `json:"theme"`
	Locale                  string `json:"locale"`
	UpdatedAt               int64  `json:"updated_at"`
}

func (p *UserPreference) ToResponse() PreferenceResponse {
	return PreferenceResponse{
		ID:                      p.ID,
		UserID:                  p.UserID,
		TranslationMode:         p.TranslationMode,
		SourceLanguage:          p.SourceLanguage,
		TargetLanguage:          p.TargetLanguage,
		SelectedModelProviderID: p.SelectedModelProviderID,
		SelectedModelName:       p.SelectedModelName,
		SelectedPromptID:        p.SelectedPromptID,
		Theme:                   p.Theme,
		Locale:                  p.Locale,
		UpdatedAt:               p.UpdatedAt,
	}
}
