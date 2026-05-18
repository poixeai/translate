package service

import (
	"errors"

	"github.com/its-rory/translate/backend/internal/model"
	"github.com/its-rory/translate/backend/internal/repository"
)

type ProviderService struct {
	repo *repository.ProviderRepository
}

func NewProviderService() *ProviderService {
	return &ProviderService{repo: repository.NewProviderRepository()}
}

func (s *ProviderService) List() ([]model.ProviderResponse, error) {
	providers, err := s.repo.List()
	if err != nil {
		return nil, err
	}
	responses := make([]model.ProviderResponse, len(providers))
	for i, p := range providers {
		responses[i] = p.ToResponse()
	}
	return responses, nil
}

func (s *ProviderService) GetByID(id int64) (*model.ProviderResponse, error) {
	p, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, errors.New("provider not found")
	}
	resp := p.ToResponse()
	return &resp, nil
}

func (s *ProviderService) Create(req model.ProviderCreateRequest) (*model.ProviderResponse, error) {
	provider := &model.Provider{
		Name:     req.Name,
		BaseURL:  req.BaseURL,
		APIKey:   req.APIKey,
		APIStyle: req.APIStyle,
		Models:   req.Models,
	}

	if err := s.repo.Create(provider); err != nil {
		return nil, err
	}

	resp := provider.ToResponse()
	return &resp, nil
}

func (s *ProviderService) Update(id int64, req model.ProviderUpdateRequest) (*model.ProviderResponse, error) {
	p, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, errors.New("provider not found")
	}

	if req.Name != "" {
		p.Name = req.Name
	}
	if req.BaseURL != "" {
		p.BaseURL = req.BaseURL
	}
	if req.APIKey != "" {
		p.APIKey = req.APIKey
	}
	if req.APIStyle != "" {
		p.APIStyle = req.APIStyle
	}
	if req.Models != "" {
		p.Models = req.Models
	}

	if err := s.repo.Update(p); err != nil {
		return nil, err
	}

	resp := p.ToResponse()
	return &resp, nil
}

func (s *ProviderService) Delete(id int64) error {
	return s.repo.Delete(id)
}
