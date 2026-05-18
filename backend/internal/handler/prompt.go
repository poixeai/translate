package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/its-rory/translate/backend/internal/model"
	"github.com/its-rory/translate/backend/internal/repository"
)

type PromptHandler struct {
	promptRepo *repository.PromptRepository
}

func NewPromptHandler() *PromptHandler {
	return &PromptHandler{promptRepo: repository.NewPromptRepository()}
}

func (h *PromptHandler) List(c *gin.Context) {
	prompts, err := h.promptRepo.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	responses := make([]model.PromptResponse, len(prompts))
	for i, p := range prompts {
		responses[i] = p.ToResponse()
	}
	c.JSON(http.StatusOK, gin.H{"data": responses})
}

func (h *PromptHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid prompt id"})
		return
	}

	prompt, err := h.promptRepo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if prompt == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "prompt not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prompt.ToResponse()})
}

func (h *PromptHandler) Create(c *gin.Context) {
	var req model.PromptCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	prompt := &model.TranslationPrompt{
		Name:    req.Name,
		Content: req.Content,
	}

	if err := h.promptRepo.Create(prompt); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": prompt.ToResponse()})
}

func (h *PromptHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid prompt id"})
		return
	}

	prompt, err := h.promptRepo.GetByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if prompt == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "prompt not found"})
		return
	}
	if prompt.IsSystem {
		c.JSON(http.StatusForbidden, gin.H{"error": "cannot update system prompt"})
		return
	}

	var req model.PromptUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Name != "" {
		prompt.Name = req.Name
	}
	if req.Content != "" {
		prompt.Content = req.Content
	}

	if err := h.promptRepo.Update(prompt); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prompt.ToResponse()})
}

func (h *PromptHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid prompt id"})
		return
	}

	if err := h.promptRepo.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "prompt deleted"})
}
