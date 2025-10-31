from rest_framework import serializers
from .models import (
    Category, Myth, Evidence, Comment, 
    Vote, ResearchRequest, Notification
)
from core.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class EvidenceSerializer(serializers.ModelSerializer):
    submitted_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Evidence
        fields = '__all__'
        read_only_fields = ('is_approved', 'submitted_by', 'created_at', 'updated_at')


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('user', 'is_approved', 'created_at', 'updated_at')


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class ResearchRequestSerializer(serializers.ModelSerializer):
    requested_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    
    class Meta:
        model = ResearchRequest
        fields = '__all__'
        read_only_fields = ('requested_by', 'status', 'completed_at', 'created_at', 'updated_at')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('is_read', 'created_at')


class MythSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), 
        source='category',
        write_only=True,
        required=False
    )
    submitted_by = UserSerializer(read_only=True)
    evidence = EvidenceSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    votes = VoteSerializer(many=True, read_only=True)
    research_requests = ResearchRequestSerializer(many=True, read_only=True)
    
    class Meta:
        model = Myth
        fields = [
            'id', 'title', 'slug', 'description', 'origin', 'category', 'category_id',
            'submitted_by', 'status', 'is_featured', 'total_votes', 'upvotes', 'downvotes',
            'created_at', 'updated_at', 'evidence', 'comments', 'votes', 'research_requests'
        ]
        read_only_fields = (
            'id', 'slug', 'submitted_by', 'status', 'is_featured', 
            'total_votes', 'upvotes', 'downvotes', 'created_at', 'updated_at',
            'evidence', 'comments', 'votes', 'research_requests'
        )
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['submitted_by'] = request.user
        return super().create(validated_data)


class MythListSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    submitted_by = UserSerializer()
    
    class Meta:
        model = Myth
        fields = [
            'id', 'title', 'slug', 'description', 'origin', 'category',
            'submitted_by', 'status', 'is_featured', 'total_votes', 
            'upvotes', 'downvotes', 'created_at'
        ]
