package handler

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/its-rory/translate/backend/internal/service"
)

type TranslateHandler struct {
	translateService *service.TranslateService
}

func NewTranslateHandler(translateService *service.TranslateService) *TranslateHandler {
	return &TranslateHandler{translateService: translateService}
}

func (h *TranslateHandler) Translate(c *gin.Context) {
	var req service.TranslateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.translateService.Translate(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *TranslateHandler) StreamTranslate(c *gin.Context) {
	var req service.StreamTranslateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("Transfer-Encoding", "chunked")

	writer := bufio.NewWriter(c.Writer)
	flusher := c.Writer

	if err := h.translateService.StreamTranslate(req, writer, flusher); err != nil {
		payload, marshalErr := json.Marshal(gin.H{"error": err.Error()})
		if marshalErr != nil {
			payload = []byte(`{"error":"translation stream failed"}`)
		}
		fmt.Fprintf(writer, "data: %s\n\n", payload)
		writer.Flush()
		flusher.Flush()
	}
}
