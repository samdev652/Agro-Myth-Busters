# Agro-MythBusters 🌾

> A comprehensive platform for validating agricultural myths and practices with evidence-based research

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Django](https://img.shields.io/badge/Django-4.2.7-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Agro-MythBusters is a full-stack web application designed to combat agricultural misinformation by providing a platform where farmers, researchers, and agricultural enthusiasts can submit, discuss, and validate agricultural myths with scientific evidence.

### Key Objectives

- **Combat Misinformation**: Provide evidence-based information about agricultural practices
- **Community Engagement**: Enable farmers and researchers to collaborate and share knowledge
- **Evidence-Based Research**: Support all claims with scientific studies and field trials
- **Educational Resource**: Create a comprehensive database of validated agricultural information

## ✨ Features

### Core Features

- **Myth Management**
  - Submit and browse agricultural myths
  - Categorize myths by topic (Fertilizers, GMOs, Organic Farming, etc.)
  - Status tracking (Pending, Under Review, Verified, Debunked, Inconclusive)
  - Rich text descriptions and origin tracking

- **Evidence System**
  - Upload scientific evidence supporting or refuting myths
  - Multiple evidence types (Scientific Studies, Expert Opinions, Field Trials, etc.)
  - Source citation and URL linking
  - Approval workflow for quality control

- **User Engagement**
  - Upvote/downvote myths
  - Comment and discuss myths
  - User profiles with role-based access (Farmer, Researcher)
  - Activity tracking and notifications

- **Research Requests**
  - Request research on specific myths
  - Assign research tasks to qualified researchers
  - Track research progress and findings
  - Automatic myth status updates based on research conclusions

### User Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based permissions (Admin, Researcher, Farmer, Public)
  - Secure password management
  - User profile customization

- **Search & Filter**
  - Full-text search across myths
  - Filter by category, status, and popularity
  - Sort by date, votes, or relevance
  - Pagination for better performance

- **Responsive Design**
  - Mobile-first approach
  - Material-UI components
  - Accessible and user-friendly interface
  - Dark/Light mode support (coming soon)

## 🛠️ Tech Stack

### Backend

- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite (development) / PostgreSQL (production recommended)
- **Documentation**: drf-spectacular (OpenAPI/Swagger)
- **Additional**: 
  - django-cors-headers
  - django-filter
  - Pillow (image handling)
  - WhiteNoise (static files)

### Frontend

- **Framework**: React 18+
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: Formik + Yup
- **Charts**: Nivo (for future analytics)

### Development & Deployment

- **Version Control**: Git
- **Containerization**: Docker & Docker Compose
- **Process Manager**: Gunicorn
- **Environment**: python-dotenv

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.9 or higher
- **Node.js** 14 or higher
- **npm** or **yarn**
- **Git**
- **Docker** (optional, for containerized deployment)

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/Agro-Myth-Busters.git
cd Agro-Myth-Busters/agro-mythbusters
```

### Backend Setup

1. **Create and activate a virtual environment**:

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

2. **Install dependencies**:

```bash
pip install -r ../requirements.txt
```

3. **Set up environment variables**:

```bash
cp .env.example .env
# Edit .env file with your settings
```

4. **Run migrations**:

```bash
python manage.py migrate
```

5. **Create a superuser**:

```bash
python manage.py createsuperuser
```

6. **Seed initial data** (categories and sample myths):

```bash
python manage.py seed_data
```

7. **Collect static files** (for production):

```bash
python manage.py collectstatic
```

### Frontend Setup

1. **Navigate to frontend directory**:

```bash
cd ../frontend
```

2. **Install dependencies**:

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**:

```bash
cp .env.example .env
# Edit .env file with your API URL
```

## 🏃 Running the Application

### Development Mode

#### Backend

```bash
cd backend
python manage.py runserver 8000
```

The API will be available at `http://localhost:8000/api/`

#### Frontend

```bash
cd frontend
npm start
# or
yarn start
```

The React app will be available at `http://localhost:3000/`

### Docker Deployment

```bash
docker-compose up --build
```

This will start both backend and frontend services in containers.

## 📚 API Documentation

### Interactive API Documentation

Once the backend is running, visit:

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

### Main API Endpoints

#### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/token/refresh/` - Refresh access token
- `GET /api/profile/` - Get current user profile
- `PUT /api/profile/` - Update user profile
- `PUT /api/auth/change-password/` - Change password

#### Myths
- `GET /api/myths/` - List all myths (paginated, filterable)
- `POST /api/myths/` - Create new myth (authenticated)
- `GET /api/myths/{id}/` - Get myth details
- `PUT /api/myths/{id}/` - Update myth (owner or admin)
- `DELETE /api/myths/{id}/` - Delete myth (owner or admin)
- `POST /api/myths/{id}/upvote/` - Upvote a myth
- `POST /api/myths/{id}/downvote/` - Downvote a myth

#### Categories
- `GET /api/categories/` - List all categories
- `POST /api/categories/` - Create category (admin only)
- `GET /api/categories/{id}/` - Get category details

#### Evidence
- `GET /api/evidence/` - List evidence (filterable by myth)
- `POST /api/evidence/` - Submit evidence (authenticated)
- `GET /api/evidence/{id}/` - Get evidence details

#### Comments
- `GET /api/comments/` - List comments (filterable by myth)
- `POST /api/comments/` - Add comment (authenticated)
- `GET /api/comments/{id}/` - Get comment details

#### Research Requests
- `GET /api/research-requests/` - List research requests
- `POST /api/research-requests/` - Create research request
- `POST /api/research-requests/{id}/assign/` - Assign to self
- `POST /api/research-requests/{id}/complete/` - Mark as complete

#### Notifications
- `GET /api/notifications/` - List user notifications
- `POST /api/notifications/{id}/mark-read/` - Mark as read
- `POST /api/notifications/mark-all-read/` - Mark all as read

## 📁 Project Structure

```
agro-mythbusters/
├── backend/
│   ├── config/              # Django project configuration
│   │   ├── settings.py      # Settings
│   │   ├── urls.py          # Main URL configuration
│   │   ├── wsgi.py          # WSGI configuration
│   │   └── asgi.py          # ASGI configuration
│   ├── core/                # Core app (authentication, users)
│   │   ├── models.py        # User model
│   │   ├── serializers.py   # User serializers
│   │   ├── views.py         # Authentication views
│   │   ├── permissions.py   # Custom permissions
│   │   └── urls.py          # Core URLs
│   ├── myths/               # Myths app (main functionality)
│   │   ├── models.py        # Myth, Evidence, Comment models
│   │   ├── serializers.py   # Myth serializers
│   │   ├── views.py         # Myth viewsets
│   │   ├── urls.py          # Myth URLs
│   │   ├── admin.py         # Admin configuration
│   │   └── management/      # Management commands
│   │       └── commands/
│   │           └── seed_data.py  # Database seeding
│   ├── manage.py            # Django management script
│   └── .env.example         # Environment variables template
├── frontend/
│   ├── public/              # Public assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   └── layout/      # Layout components
│   │   ├── layouts/         # Page layouts
│   │   ├── pages/           # Page components
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── myths/       # Myth pages
│   │   │   └── user/        # User pages
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   ├── package.json         # Dependencies
│   └── .env.example         # Environment variables template
├── requirements.txt         # Python dependencies
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile.backend       # Backend Docker image
├── Dockerfile.frontend      # Frontend Docker image
└── README.md               # This file
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
# or
yarn test
```

## 🔐 Security Considerations

- Change `SECRET_KEY` in production
- Use HTTPS in production
- Set `DEBUG=False` in production
- Use strong passwords
- Enable CSRF protection
- Configure CORS properly
- Use environment variables for sensitive data
- Regular security updates

## 🚢 Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Configure production database (PostgreSQL recommended)
- [ ] Set up proper SECRET_KEY
- [ ] Configure email backend
- [ ] Set up HTTPS
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up static file serving
- [ ] Configure CORS for production domain
- [ ] Set up logging
- [ ] Enable security middleware
- [ ] Set up backup strategy

### Deployment Platforms

The application can be deployed on:

- **Backend**: Heroku, AWS EB, Digital Ocean, Railway, Render
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: AWS RDS, Heroku Postgres, Digital Ocean Managed Databases
- **Full Stack**: AWS, Google Cloud, Azure, Docker Swarm, Kubernetes

## 👥 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Django and Django REST Framework communities
- React and Material-UI teams
- All contributors and supporters of agricultural education
- Open source community

## 📞 Support

For support, email support@agromythbusters.com or open an issue in the repository.

---

**Note**: This is an MVP (Minimum Viable Product) ready for investor presentation. Features and improvements are continuously being added.

Made with ❤️ for sustainable agriculture
