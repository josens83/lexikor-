#!/bin/bash
# LexiKor Quick Start Script
# This script sets up the entire development environment

set -e

echo "╔════════════════════════════════════════╗"
echo "║   🚀 LexiKor Quick Start Setup       ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker found${NC}"
echo ""

# Step 1: Create .env file for backend
echo -e "${BLUE}📝 Step 1/5: Setting up backend environment...${NC}"

if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}Creating backend/.env from .env.example...${NC}"
    cp backend/.env.example backend/.env

    echo -e "${YELLOW}⚠️  IMPORTANT: Please edit backend/.env and add your API keys:${NC}"
    echo "   - OPENAI_API_KEY (required for AI chat)"
    echo "   - STRIPE_SECRET_KEY (required for payments)"
    echo "   - AWS credentials (for file storage)"
    echo ""
    read -p "Press Enter after you've added the API keys, or press Ctrl+C to exit and add them later..."
else
    echo -e "${GREEN}✅ backend/.env already exists${NC}"
fi
echo ""

# Step 2: Start infrastructure services
echo -e "${BLUE}🐳 Step 2/5: Starting Docker services...${NC}"
echo "Starting PostgreSQL, Redis, and Elasticsearch..."

docker compose up -d postgres redis elasticsearch

echo -e "${YELLOW}⏳ Waiting for services to be healthy (30 seconds)...${NC}"
sleep 30

# Check service health
if docker compose ps postgres | grep -q "healthy"; then
    echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL might not be fully ready yet${NC}"
fi

if docker compose ps redis | grep -q "healthy"; then
    echo -e "${GREEN}✅ Redis is ready${NC}"
else
    echo -e "${YELLOW}⚠️  Redis might not be fully ready yet${NC}"
fi

echo ""

# Step 3: Install backend dependencies and run migrations
echo -e "${BLUE}📦 Step 3/5: Installing backend dependencies...${NC}"

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

echo -e "${YELLOW}Installing Python packages...${NC}"
pip install -q --upgrade pip
pip install -q -r requirements.txt

echo -e "${GREEN}✅ Backend dependencies installed${NC}"
echo ""

# Step 4: Initialize database
echo -e "${BLUE}🗄️  Step 4/5: Initializing database...${NC}"

# Run Alembic migrations
echo -e "${YELLOW}Running database migrations...${NC}"
alembic upgrade head

echo -e "${GREEN}✅ Database schema created${NC}"

# Seed database
echo -e "${YELLOW}Seeding database with initial data...${NC}"
python scripts/seed_db.py

echo -e "${GREEN}✅ Database seeded${NC}"
echo ""
echo -e "${GREEN}🔐 Admin account created:${NC}"
echo "   Email: admin@lexikor.ai"
echo "   Password: admin123!@#"
echo ""

cd ..

# Step 5: Install frontend dependencies
echo -e "${BLUE}🎨 Step 5/5: Setting up frontend...${NC}"

cd frontend

if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating frontend/.env...${NC}"
    echo "VITE_API_URL=http://localhost:8000" > .env
    echo -e "${GREEN}✅ frontend/.env created${NC}"
else
    echo -e "${GREEN}✅ frontend/.env already exists${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Node.js packages (this may take a few minutes)...${NC}"
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✅ node_modules already exists${NC}"
fi

cd ..

# Done!
echo ""
echo "╔════════════════════════════════════════╗"
echo "║   ✨ Setup Complete!                 ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}🎉 LexiKor is ready to run!${NC}"
echo ""
echo "To start the services:"
echo ""
echo "  ${BLUE}Option 1: Start everything with Docker Compose${NC}"
echo "    $ docker compose up"
echo ""
echo "  ${BLUE}Option 2: Start backend and frontend separately${NC}"
echo "    Terminal 1 (Backend):"
echo "      $ cd backend"
echo "      $ source venv/bin/activate"
echo "      $ uvicorn app.main:app --reload"
echo ""
echo "    Terminal 2 (Frontend):"
echo "      $ cd frontend"
echo "      $ npm run dev"
echo ""
echo "Once running, access:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
echo "Admin login:"
echo "  - Email: admin@lexikor.ai"
echo "  - Password: admin123!@#"
echo ""
echo -e "${YELLOW}⚠️  Remember to add your API keys to backend/.env:${NC}"
echo "  - OPENAI_API_KEY (for AI features)"
echo "  - STRIPE_SECRET_KEY (for payments)"
echo ""
echo "For more details, see BACKEND_DEPLOYMENT.md"
echo ""
