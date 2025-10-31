from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'myths', views.MythViewSet, basename='myth')
router.register(r'evidence', views.EvidenceViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'votes', views.VoteViewSet)
router.register(r'research-requests', views.ResearchRequestViewSet, basename='research-request')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# Additional URL patterns for nested routes
urlpatterns = [
    # Custom actions for myths
    path('myths/<int:pk>/upvote/', views.MythViewSet.as_view({'post': 'upvote'}), name='myth-upvote'),
    path('myths/<int:pk>/downvote/', views.MythViewSet.as_view({'post': 'downvote'}), name='myth-downvote'),
    
    # Custom actions for research requests
    path('research-requests/<int:pk>/assign/', 
         views.ResearchRequestViewSet.as_view({'post': 'assign'}), 
         name='research-request-assign'),
    path('research-requests/<int:pk>/complete/', 
         views.ResearchRequestViewSet.as_view({'post': 'complete'}), 
         name='research-request-complete'),
    
    # Custom actions for notifications
    path('notifications/mark-all-read/', 
         views.NotificationViewSet.as_view({'post': 'mark_all_as_read'}), 
         name='notification-mark-all-read'),
    path('notifications/<int:pk>/mark-read/', 
         views.NotificationViewSet.as_view({'post': 'mark_as_read'}), 
         name='notification-mark-read'),
    
    # Include router URLs
    path('', include(router.urls)),
]
