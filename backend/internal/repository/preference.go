package repository

import (
	"database/sql"
	"fmt"

	"github.com/its-rory/translate/backend/internal/database"
	"github.com/its-rory/translate/backend/internal/model"
)

type PreferenceRepository struct{}

func NewPreferenceRepository() *PreferenceRepository {
	return &PreferenceRepository{}
}

func (r *PreferenceRepository) GetByUserID(userID int64) (*model.UserPreference, error) {
	var p model.UserPreference
	var providerID sql.NullInt64
	var promptID sql.NullInt64
	err := database.DB.QueryRow(
		"SELECT id, user_id, translation_mode, source_language, target_language, selected_model_provider_id, selected_model_name, selected_prompt_id, theme, locale, updated_at FROM user_preferences WHERE user_id = ?",
		userID,
	).Scan(&p.ID, &p.UserID, &p.TranslationMode, &p.SourceLanguage, &p.TargetLanguage, &providerID, &p.SelectedModelName, &promptID, &p.Theme, &p.Locale, &p.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get preference by user id: %w", err)
	}
	if providerID.Valid {
		p.SelectedModelProviderID = &providerID.Int64
	}
	if promptID.Valid {
		p.SelectedPromptID = &promptID.Int64
	}
	return &p, nil
}

func (r *PreferenceRepository) Upsert(p *model.UserPreference) error {
	now := model.NowUnix()
	existing, err := r.GetByUserID(p.UserID)
	if err != nil {
		return err
	}

	if existing == nil {
		var providerID interface{}
		var promptID interface{}
		if p.SelectedModelProviderID != nil {
			providerID = *p.SelectedModelProviderID
		}
		if p.SelectedPromptID != nil {
			promptID = *p.SelectedPromptID
		}
		result, err := database.DB.Exec(
			"INSERT INTO user_preferences (user_id, translation_mode, source_language, target_language, selected_model_provider_id, selected_model_name, selected_prompt_id, theme, locale, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			p.UserID, p.TranslationMode, p.SourceLanguage, p.TargetLanguage, providerID, p.SelectedModelName, promptID, p.Theme, p.Locale, now,
		)
		if err != nil {
			return fmt.Errorf("failed to create preference: %w", err)
		}
		id, _ := result.LastInsertId()
		p.ID = id
	} else {
		p.ID = existing.ID
		var providerID interface{}
		var promptID interface{}
		if p.SelectedModelProviderID != nil {
			providerID = *p.SelectedModelProviderID
		}
		if p.SelectedPromptID != nil {
			promptID = *p.SelectedPromptID
		}
		_, err := database.DB.Exec(
			"UPDATE user_preferences SET translation_mode = ?, source_language = ?, target_language = ?, selected_model_provider_id = ?, selected_model_name = ?, selected_prompt_id = ?, theme = ?, locale = ?, updated_at = ? WHERE id = ?",
			p.TranslationMode, p.SourceLanguage, p.TargetLanguage, providerID, p.SelectedModelName, promptID, p.Theme, p.Locale, now, p.ID,
		)
		if err != nil {
			return fmt.Errorf("failed to update preference: %w", err)
		}
	}
	p.UpdatedAt = now
	return nil
}
