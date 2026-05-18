package service

import (
	"errors"

	"github.com/its-rory/translate/backend/internal/model"
	"github.com/its-rory/translate/backend/internal/repository"
)

type PreferenceService struct {
	repo *repository.PreferenceRepository
}

func NewPreferenceService() *PreferenceService {
	return &PreferenceService{repo: repository.NewPreferenceRepository()}
}

func (s *PreferenceService) GetByUserID(userID int64) (*model.PreferenceResponse, error) {
	pref, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}
	if pref == nil {
		pref = &model.UserPreference{
			UserID:          userID,
			TranslationMode: "manual",
			SourceLanguage:  "auto",
			TargetLanguage:  "",
			Theme:           "system",
			Locale:          "en",
		}
	}
	resp := pref.ToResponse()
	return &resp, nil
}

func (s *PreferenceService) Upsert(userID int64, req model.PreferenceUpdateRequest) (*model.PreferenceResponse, error) {
	pref := &model.UserPreference{
		UserID:                  userID,
		TranslationMode:         req.TranslationMode,
		SourceLanguage:          req.SourceLanguage,
		TargetLanguage:          req.TargetLanguage,
		SelectedModelProviderID: req.SelectedModelProviderID,
		SelectedModelName:       req.SelectedModelName,
		SelectedPromptID:        req.SelectedPromptID,
		Theme:                   req.Theme,
		Locale:                  req.Locale,
	}

	if pref.TranslationMode == "" {
		pref.TranslationMode = "manual"
	}
	if pref.SourceLanguage == "" {
		pref.SourceLanguage = "auto"
	}
	if pref.Theme == "" {
		pref.Theme = "system"
	}
	if pref.Locale == "" {
		pref.Locale = "en"
	}

	if err := s.repo.Upsert(pref); err != nil {
		return nil, err
	}

	resp := pref.ToResponse()
	return &resp, nil
}

func (s *PreferenceService) GetSelectedModel(userID int64) (*int64, *string, error) {
	pref, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, nil, err
	}
	if pref == nil {
		return nil, nil, errors.New("preference not found")
	}
	return pref.SelectedModelProviderID, &pref.SelectedModelName, nil
}
