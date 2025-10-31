from rest_framework import status, permissions, generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .models import UserActivity
from .serializers import (
    UserSerializer, CustomTokenObtainPairSerializer,
    UserActivitySerializer, UserRegistrationSerializer
)
from .permissions import IsOwnerOrReadOnly

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    """
    Register a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update user profile.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_object(self):
        return self.request.user


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token obtain view that includes user data in the response.
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserActivityView(viewsets.ReadOnlyModelViewSet):
    """
    View to list all activities for the authenticated user.
    """
    serializer_class = UserActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user).order_by('-created_at')


class ChangePasswordView(APIView):
    """
    An endpoint for changing password.
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = self.request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(old_password):
            return Response(
                {"old_password": ["Wrong password."]}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user.set_password(new_password)
        user.save()
        
        return Response(
            {"message": "Password updated successfully"}, 
            status=status.HTTP_200_OK
        )
