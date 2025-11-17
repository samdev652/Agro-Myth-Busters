# Quick Start Guide - Agro-MythBusters MVP

## 🎯 Quick Setup (5 minutes)

### Prerequisites Checklist
- [ ] Python 3.9+ installed
- [ ] Node.js 14+ installed
- [ ] Git installed

### Step 1: Clone and Setup Backend (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd Agro-Myth-Busters/agro-mythbusters

# Backend setup
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt

# Setup environment
cp .env.example .env

# Run migrations and seed data
python manage.py migrate
python manage.py seed_data

# Create admin user
python manage.py createsuperuser
# Email: admin@example.com
# Password: (choose a strong password)

# Start backend
python manage.py runserver 8000
```

Backend will be running at `http://localhost:8000`

### Step 2: Setup Frontend (2 minutes)

Open a NEW terminal window:

```bash
cd agro-mythbusters/frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start frontend
npm start
```

Frontend will be running at `http://localhost:3000`

### Step 3: Test the Application (1 minute)

1. Open browser to `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Explore the preloaded myths
4. Try upvoting, commenting, and browsing

## 🐳 Docker Quick Start (Alternative)

If you have Docker installed:

```bash
# From the project root
docker-compose up --build
```

Access:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Admin Panel: `http://localhost:8000/admin`

## 📚 Key Features to Demonstrate

### For Investors

1. **Homepage** (`/`)
   - Modern, professional design
   - Clear value proposition
   - Featured myths showcase

2. **Myths Browse** (`/myths`)
   - Advanced filtering and search
   - Category organization
   - Status tracking
   - Pagination

3. **Myth Details** (`/myths/{id}`)
   - Detailed myth information
   - Evidence submission
   - Community comments
   - Voting system

4. **User Profile** (`/profile`)
   - User management
   - Submission tracking
   - Password management

5. **Admin Panel** (`/admin`)
   - Full content management
   - User administration
   - Research request management

### Sample Data Included

The database is pre-seeded with:
- 8 Categories (Fertilizers, GMOs, Organic Farming, etc.)
- 8 Sample Myths with realistic descriptions
- Various status examples (Verified, Debunked, Under Review)

## 🔑 API Documentation

Once running, access interactive API docs:

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

## 🎨 Key Technologies

**Backend:**
- Django 4.2.7
- Django REST Framework
- JWT Authentication
- SQLite/PostgreSQL

**Frontend:**
- React 18
- Material-UI
- Redux Toolkit
- Axios

## 📊 Demo Accounts

After running `seed_data`, you can create test accounts:

**Admin:** (created via createsuperuser)
- Access admin panel
- Manage all content

**Researcher:**
- Register account
- Toggle "I am a researcher" in profile

**Farmer:**
- Register account
- Toggle "I am a farmer" in profile

## 🚀 Investor Pitch Highlights

1. **Scalability:** 
   - RESTful API design
   - Containerized deployment ready
   - Database-agnostic (SQLite → PostgreSQL)

2. **User Experience:**
   - Mobile-responsive design
   - Intuitive navigation
   - Real-time search and filtering

3. **Content Management:**
   - Moderation workflow
   - Evidence-based verification
   - Community engagement features

4. **Technical Excellence:**
   - Modern tech stack
   - Security best practices
   - Well-documented code
   - Comprehensive API documentation

5. **Growth Potential:**
   - Multi-language support (ready)
   - Analytics dashboard (planned)
   - Mobile apps (future)
   - AI-powered recommendations (future)

## 🔧 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
python manage.py runserver 8001
```

**Database errors:**
```bash
rm db.sqlite3
python manage.py migrate
python manage.py seed_data
```

### Frontend Issues

**Port 3000 already in use:**
```bash
PORT=3001 npm start
```

**Dependencies issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For technical issues during the demo:
- Check console logs (F12 in browser)
- Review error messages
- Check both backend and frontend terminals

## 🎯 Next Steps After MVP

1. **Phase 2 Features:**
   - Advanced analytics dashboard
   - Email notifications
   - Social media integration
   - Mobile applications

2. **Infrastructure:**
   - Cloud deployment (AWS/GCP/Azure)
   - CDN for static assets
   - Production database
   - Monitoring and logging

3. **Marketing:**
   - SEO optimization
   - Content marketing
   - Community building
   - Partnership development

---

**Ready to impress investors!** 🌾✨

The MVP is fully functional, professionally designed, and demonstrates the core value proposition effectively.
