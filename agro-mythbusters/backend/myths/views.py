from rest_framework import viewsets, status, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.utils import timezone
from .models import (
    Category, Myth, Evidence, Comment, 
    Vote, ResearchRequest, Notification
)
from .serializers import (
    CategorySerializer, MythSerializer, 
    EvidenceSerializer, CommentSerializer,
    VoteSerializer, ResearchRequestSerializer,
    NotificationSerializer, MythListSerializer
)
from core.permissions import IsOwnerOrReadOnly, IsResearcherOrReadOnly, IsAdminOrReadOnly


class CategoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class MythViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing myths.
    """
    queryset = Myth.objects.all()
    serializer_class = MythSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_featured', 'category']
    search_fields = ['title', 'description', 'origin']
    ordering_fields = ['created_at', 'updated_at', 'total_votes']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return MythListSerializer
        return MythSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by search query
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(origin__icontains=search_query)
            )
        
        # Filter by category name
        category = self.request.query_params.get('category_name', None)
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        
        # Filter by user
        user = self.request.query_params.get('user', None)
        if user:
            queryset = queryset.filter(submitted_by__id=user)
        
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by featured
        is_featured = self.request.query_params.get('is_featured', None)
        if is_featured is not None:
            queryset = queryset.filter(is_featured=is_featured.lower() == 'true')
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        """Upvote a myth."""
        return self._handle_vote(request, pk, 'upvote')
    
    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        """Downvote a myth."""
        return self._handle_vote(request, pk, 'downvote')
    
    def _handle_vote(self, request, pk, vote_type):
        myth = self.get_object()
        user = request.user
        
        # Check if user has already voted
        vote = Vote.objects.filter(myth=myth, user=user).first()
        
        if vote:
            # If same vote type, remove the vote
            if vote.vote_type == vote_type:
                vote.delete()
                # Update vote counts
                myth.total_votes -= 1
                if vote_type == 'upvote':
                    myth.upvotes -= 1
                else:
                    myth.downvotes -= 1
                myth.save()
                return Response({'status': 'vote removed'})
            # If different vote type, update the vote
            else:
                # Update previous vote counts
                if vote.vote_type == 'upvote':
                    myth.upvotes -= 1
                    myth.downvotes += 1
                else:
                    myth.downvotes -= 1
                    myth.upvotes += 1
                # Update vote
                vote.vote_type = vote_type
                vote.save()
        else:
            # Create new vote
            Vote.objects.create(myth=myth, user=user, vote_type=vote_type)
            # Update vote counts
            myth.total_votes += 1
            if vote_type == 'upvote':
                myth.upvotes += 1
            else:
                myth.downvotes += 1
        
        myth.save()
        return Response({'status': 'vote recorded'})


class EvidenceViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing evidence.
    """
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['evidence_type', 'is_approved', 'myth']
    search_fields = ['title', 'description', 'source_citation']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by myth
        myth = self.request.query_params.get('myth', None)
        if myth:
            queryset = queryset.filter(myth_id=myth)
        
        # Filter by evidence type
        evidence_type = self.request.query_params.get('evidence_type', None)
        if evidence_type:
            queryset = queryset.filter(evidence_type=evidence_type)
        
        # Filter by approval status
        is_approved = self.request.query_params.get('is_approved', None)
        if is_approved is not None:
            queryset = queryset.filter(is_approved=is_approved.lower() == 'true')
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing comments.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['myth', 'is_approved']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by myth
        myth = self.request.query_params.get('myth', None)
        if myth:
            queryset = queryset.filter(myth_id=myth)
        
        # Filter by user
        user = self.request.query_params.get('user', None)
        if user:
            queryset = queryset.filter(user_id=user)
        
        # Filter by approval status
        is_approved = self.request.query_params.get('is_approved', None)
        if is_approved is not None:
            queryset = queryset.filter(is_approved=is_approved.lower() == 'true')
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResearchRequestViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing research requests.
    """
    queryset = ResearchRequest.objects.all()
    serializer_class = ResearchRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsResearcherOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'assigned_to', 'myth']
    ordering_fields = ['created_at', 'updated_at', 'completed_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Regular users can only see their own requests
        if not user.is_staff and not user.is_researcher:
            return queryset.filter(requested_by=user)
        
        # Researchers can see their assigned requests and their own requests
        if user.is_researcher and not user.is_staff:
            return queryset.filter(Q(assigned_to=user) | Q(requested_by=user))
        
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by myth
        myth = self.request.query_params.get('myth', None)
        if myth:
            queryset = queryset.filter(myth_id=myth)
        
        # Filter by requester
        requested_by = self.request.query_params.get('requested_by', None)
        if requested_by:
            queryset = queryset.filter(requested_by_id=requested_by)
        
        # Filter by assignee
        assigned_to = self.request.query_params.get('assigned_to', None)
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign a research request to the current user."""
        research_request = self.get_object()
        if research_request.assigned_to and research_request.assigned_to != request.user:
            return Response(
                {'error': 'This research request is already assigned to someone else.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        research_request.assigned_to = request.user
        research_request.status = 'in_progress'
        research_request.save()
        
        return Response({'status': 'research request assigned'})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a research request as completed."""
        research_request = self.get_object()
        
        if research_request.assigned_to != request.user and not request.user.is_staff:
            return Response(
                {'error': 'You are not authorized to complete this research request.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        research_request.status = 'completed'
        research_request.completed_at = timezone.now()
        research_request.save()
        
        # Update the related myth status based on findings
        myth = research_request.myth
        findings = request.data.get('findings', '').lower()
        
        if 'verified' in findings:
            myth.status = 'verified'
        elif 'debunked' in findings:
            myth.status = 'debunked'
        else:
            myth.status = 'inconclusive'
        
        myth.save()
        
        return Response({'status': 'research request completed'})


class VoteViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and managing votes on myths and evidence.
    """
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['vote_type', 'content_type', 'object_id', 'user']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return only the votes for the current user."""
        return Vote.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the current user when creating a vote."""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        """Upvote a myth or evidence."""
        return self._vote(request, Vote.UPVOTE)

    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        """Downvote a myth or evidence."""
        return self._vote(request, Vote.DOWNVOTE)

    def _vote(self, request, vote_type):
        """Helper method to handle voting."""
        content_type = request.data.get('content_type')
        object_id = request.data.get('object_id')
        
        if not content_type or not object_id:
            return Response(
                {"error": "content_type and object_id are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already voted
        vote = Vote.objects.filter(
            user=request.user,
            content_type=content_type,
            object_id=object_id
        ).first()
        
        if vote:
            if vote.vote_type == vote_type:
                # If same vote type, remove the vote
                vote.delete()
            else:
                # If different vote type, update the vote
                vote.vote_type = vote_type
                vote.save()
        else:
            # Create new vote
            vote = Vote.objects.create(
                user=request.user,
                content_type=content_type,
                object_id=object_id,
                vote_type=vote_type
            )
        
        # Get the updated vote count
        content_object = vote.content_object
        if hasattr(content_object, 'update_vote_count'):
            content_object.update_vote_count()
        
        return Response({"status": "vote updated"}, status=status.HTTP_200_OK)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and managing notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read."""
        updated = Notification.objects.filter(
            user=request.user, 
            is_read=False
        ).update(is_read=True)
        
        return Response({
            'status': f'marked {updated} notifications as read'
        })
