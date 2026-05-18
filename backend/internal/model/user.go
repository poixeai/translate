package model

import "time"

type User struct {
	ID           int64  `json:"id"`
	Username     string `json:"username"`
	PasswordHash string `json:"-"`
	Role         string `json:"role"`
	DisplayName  string `json:"display_name"`
	Email        string `json:"email"`
	AvatarURL    string `json:"avatar_url"`
	CreatedAt    int64  `json:"created_at"`
	UpdatedAt    int64  `json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}

type UserCreateRequest struct {
	Username    string `json:"username" binding:"required,min=3,max=50"`
	Password    string `json:"password" binding:"required,min=6"`
	Role        string `json:"role" binding:"omitempty,oneof=ADMIN USER"`
	DisplayName string `json:"display_name"`
	Email       string `json:"email"`
}

type UserUpdateRequest struct {
	Role        string `json:"role" binding:"omitempty,oneof=ADMIN USER"`
	DisplayName string `json:"display_name"`
	Email       string `json:"email"`
	AvatarURL   string `json:"avatar_url"`
}

type PasswordUpdateRequest struct {
	Password string `json:"password" binding:"required,min=6"`
}

type UserResponse struct {
	ID          int64  `json:"id"`
	Username    string `json:"username"`
	Role        string `json:"role"`
	DisplayName string `json:"display_name"`
	Email       string `json:"email"`
	AvatarURL   string `json:"avatar_url"`
	CreatedAt   int64  `json:"created_at"`
	UpdatedAt   int64  `json:"updated_at"`
}

func (u *User) ToResponse() UserResponse {
	return UserResponse{
		ID:          u.ID,
		Username:    u.Username,
		Role:        u.Role,
		DisplayName: u.DisplayName,
		Email:       u.Email,
		AvatarURL:   u.AvatarURL,
		CreatedAt:   u.CreatedAt,
		UpdatedAt:   u.UpdatedAt,
	}
}

func NowUnix() int64 {
	return time.Now().UnixMilli()
}
