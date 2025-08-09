PORT = 5173

serve:
	@echo "Starting server on http://localhost:$(PORT)..."
	@python3 -m http.server $(PORT) >/dev/null 2>&1 & echo "Serving on http://localhost:$(PORT) (Ctrl+C to stop in this shell if foreground)" || true

open:
	@python3 -m webbrowser http://localhost:$(PORT)

stop:
	@echo "Stopping server... Done."
	@pkill -f "python3 -m http.server $(PORT)" || echo "No server running on port $(PORT)"

.PHONY: serve open stop