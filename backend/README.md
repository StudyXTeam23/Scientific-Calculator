# Scientific Calculator Backend API

FastAPI backend service for the Scientific Calculator application.

## 🚀 Quick Start

### Installation

```bash
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Server

```bash
# Development mode with hot reload
uvicorn app.main:app --reload --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### API Documentation

Once the server is running, visit:
- Interactive API docs (Swagger): http://localhost:8000/docs
- Alternative API docs (ReDoc): http://localhost:8000/redoc

## 📋 API Endpoints

### Health Check
```
GET /api/health
```

Returns the health status of the API.

### Calculate Expression
```
POST /api/calculate
```

Calculates a mathematical expression.

**Request Body:**
```json
{
  "expression": "sin(30) + log(100)",
  "angle_mode": "deg",
  "precision": 10
}
```

**Response:**
```json
{
  "success": true,
  "result": "2.5",
  "expression": "sin(30) + log(100)",
  "formatted_expression": "sin(30°) + log(100)",
  "error": null,
  "computation_time_ms": 2.5
}
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=app tests/
```

## 🐳 Docker

```bash
# Build image
docker build -t scientific-calculator-backend .

# Run container
docker run -p 8000:8000 scientific-calculator-backend
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── models/
│   │   └── calculator.py    # Pydantic models
│   ├── routers/
│   │   └── calculate.py     # API routes
│   ├── services/
│   │   ├── calculation.py   # Calculation service
│   │   └── validation.py    # Validation service
│   └── middleware/          # Custom middleware
├── tests/                   # Test files
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
└── README.md               # This file
```

## 🔒 Security

- Input validation using Pydantic
- Expression sanitization
- Rate limiting (to be implemented)
- CORS configuration

## 📝 License

MIT

