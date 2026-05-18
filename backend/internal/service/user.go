package service

import (
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"

	"github.com/its-rory/translate/backend/internal/model"
	"github.com/its-rory/translate/backend/internal/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService() *UserService {
	return &UserService{repo: repository.NewUserRepository()}
}

func (s *UserService) List() ([]model.UserResponse, error) {
	users, err := s.repo.List()
	if err != nil {
		return nil, err
	}
	responses := make([]model.UserResponse, len(users))
	for i, u := range users {
		responses[i] = u.ToResponse()
	}
	return responses, nil
}

func (s *UserService) GetByID(id int64) (*model.UserResponse, error) {
	u, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if u == nil {
		return nil, errors.New("user not found")
	}
	resp := u.ToResponse()
	return &resp, nil
}

func (s *UserService) Create(req model.UserCreateRequest) (*model.UserResponse, error) {
	existing, err := s.repo.GetByUsername(req.Username)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("username already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	role := req.Role
	if role == "" {
		role = "USER"
	}

	user := &model.User{
		Username:     req.Username,
		PasswordHash: string(hashedPassword),
		Role:         role,
		DisplayName:  req.DisplayName,
		Email:        req.Email,
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	resp := user.ToResponse()
	return &resp, nil
}

func (s *UserService) Update(id int64, req model.UserUpdateRequest) (*model.UserResponse, error) {
	u, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if u == nil {
		return nil, errors.New("user not found")
	}

	if req.Role != "" {
		u.Role = req.Role
	}
	if req.DisplayName != "" {
		u.DisplayName = req.DisplayName
	}
	if req.Email != "" {
		u.Email = req.Email
	}
	if req.AvatarURL != "" {
		u.AvatarURL = req.AvatarURL
	}

	if err := s.repo.Update(u); err != nil {
		return nil, err
	}

	resp := u.ToResponse()
	return &resp, nil
}

func (s *UserService) ChangePassword(id int64, password string) error {
	u, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	if u == nil {
		return errors.New("user not found")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	return s.repo.UpdatePassword(id, string(hashedPassword))
}

func (s *UserService) Delete(id int64) error {
	return s.repo.Delete(id)
}
