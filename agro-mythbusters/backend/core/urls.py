from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'activities', views.UserActivityView, basename='user-activity')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # User profile endpoints
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    
    # Include router URLs
    path('', include(router.urls)),
]
