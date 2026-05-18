package service

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/its-rory/translate/backend/internal/config"
	"github.com/its-rory/translate/backend/internal/database"
	"github.com/its-rory/translate/backend/internal/model"
)

type AuthService struct{}

func NewAuthService() *AuthService {
	return &AuthService{}
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
	TokenType    string `json:"token_type"`
}

type Claims struct {
	UserID   int64  `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func (s *AuthService) Login(req LoginRequest) (*TokenResponse, error) {
	var u model.User
	err := database.DB.QueryRow(
		"SELECT id, username, password_hash, role FROM users WHERE username = ?",
		req.Username,
	).Scan(&u.ID, &u.Username, &u.PasswordHash, &u.Role)
	if err == sql.ErrNoRows {
		return nil, errors.New("invalid credentials")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query user: %w", err)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	accessToken, expiresIn, err := s.generateAccessToken(u.ID, u.Username, u.Role)
	if err != nil {
		return nil, fmt.Errorf("failed to generate access token: %w", err)
	}

	refreshToken, err := s.generateRefreshToken(u.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	return &TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    expiresIn,
		TokenType:    "Bearer",
	}, nil
}

func (s *AuthService) RefreshToken(refreshToken string) (*TokenResponse, error) {
	var rt struct {
		ID        int64
		UserID    int64
		ExpiresAt int64
	}
	err := database.DB.QueryRow(
		"SELECT id, user_id, expires_at FROM refresh_tokens WHERE token = ?",
		refreshToken,
	).Scan(&rt.ID, &rt.UserID, &rt.ExpiresAt)
	if err == sql.ErrNoRows {
		return nil, errors.New("invalid refresh token")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to query refresh token: %w", err)
	}

	if rt.ExpiresAt < time.Now().UnixMilli() {
		database.DB.Exec("DELETE FROM refresh_tokens WHERE id = ?", rt.ID)
		return nil, errors.New("refresh token expired")
	}

	var u model.User
	err = database.DB.QueryRow(
		"SELECT id, username, role FROM users WHERE id = ?",
		rt.UserID,
	).Scan(&u.ID, &u.Username, &u.Role)
	if err != nil {
		return nil, errors.New("user not found")
	}

	database.DB.Exec("DELETE FROM refresh_tokens WHERE id = ?", rt.ID)

	accessToken, expiresIn, err := s.generateAccessToken(u.ID, u.Username, u.Role)
	if err != nil {
		return nil, fmt.Errorf("failed to generate access token: %w", err)
	}

	newRefreshToken, err := s.generateRefreshToken(u.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to generate refresh token: %w", err)
	}

	return &TokenResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		ExpiresIn:    expiresIn,
		TokenType:    "Bearer",
	}, nil
}

func (s *AuthService) Logout(refreshToken string) {
	database.DB.Exec("DELETE FROM refresh_tokens WHERE token = ?", refreshToken)
}

func (s *AuthService) ValidateAccessToken(tokenString string) (*Claims, error) {
	cfg := config.GetConfig()
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(cfg.JWTSecret), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

func (s *AuthService) generateAccessToken(userID int64, username, role string) (string, int64, error) {
	cfg := config.GetConfig()
	expiresIn := int64(3600)
	expiresAt := time.Now().Add(time.Duration(expiresIn) * time.Second)

	claims := &Claims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(cfg.JWTSecret))
	if err != nil {
		return "", 0, err
	}

	return tokenString, expiresIn, nil
}

func (s *AuthService) generateRefreshToken(userID int64) (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	token := hex.EncodeToString(bytes)
	expiresAt := time.Now().Add(7 * 24 * time.Hour).UnixMilli()
	now := model.NowUnix()

	_, err := database.DB.Exec(
		"INSERT INTO refresh_tokens (user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?)",
		userID, token, expiresAt, now,
	)
	if err != nil {
		return "", fmt.Errorf("failed to store refresh token: %w", err)
	}

	return token, nil
}
