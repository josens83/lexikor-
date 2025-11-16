.PHONY: help build up down logs clean install

help:
	@echo "LexiKor - Korean Legal AI Platform"
	@echo ""
	@echo "Available commands:"
	@echo "  make build     - Build Docker containers"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - View logs"
	@echo "  make clean     - Clean up containers and volumes"
	@echo "  make install   - Install dependencies"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "Services started!"
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@echo "API Docs: http://localhost:8000/docs"

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Done!"

dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

db-migrate:
	cd backend && alembic upgrade head

db-reset:
	cd backend && alembic downgrade base && alembic upgrade head
