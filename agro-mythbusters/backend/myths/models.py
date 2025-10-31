from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Category(models.Model):
    """Categories for organizing myths (e.g., Crops, Livestock, Soil, etc.)"""
    name = models.CharField(_('name'), max_length=100, unique=True)
    description = models.TextField(_('description'), blank=True)
    icon = models.CharField(_('icon'), max_length=50, blank=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')
        ordering = ['name']

    def __str__(self):
        return self.name


class Myth(models.Model):
    """A belief or practice that needs validation."""
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending Review')
        UNDER_REVIEW = 'under_review', _('Under Review')
        VERIFIED = 'verified', _('Verified')
        DEBUNKED = 'debunked', _('Debunked')
        INCONCLUSIVE = 'inconclusive', _('Inconclusive')
    
    title = models.CharField(_('title'), max_length=255)
    slug = models.SlugField(_('slug'), max_length=300, unique=True)
    description = models.TextField(_('description'))
    origin = models.CharField(_('origin'), max_length=255, blank=True)
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='myths',
        verbose_name=_('category')
    )
    submitted_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='submitted_myths',
        verbose_name=_('submitted by')
    )
    status = models.CharField(
        _('status'), 
        max_length=20, 
        choices=Status.choices, 
        default=Status.PENDING
    )
    is_featured = models.BooleanField(_('is featured'), default=False)
    total_votes = models.IntegerField(_('total votes'), default=0)
    upvotes = models.IntegerField(_('upvotes'), default=0)
    downvotes = models.IntegerField(_('downvotes'), default=0)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('myth')
        verbose_name_plural = _('myths')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['category', 'status']),
        ]

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # Ensure slug is unique
            counter = 1
            while Myth.objects.filter(slug=self.slug).exists():
                self.slug = f"{slugify(self.title)}-{counter}"
                counter += 1
        super().save(*args, **kwargs)


class Evidence(models.Model):
    """Evidence supporting or debunking a myth."""
    class EvidenceType(models.TextChoices):
        SCIENTIFIC_STUDY = 'scientific_study', _('Scientific Study')
        EXPERT_OPINION = 'expert_opinion', _('Expert Opinion')
        FIELD_TRIAL = 'field_trial', _('Field Trial')
        TRADITIONAL_KNOWLEDGE = 'traditional_knowledge', _('Traditional Knowledge')
        OTHER = 'other', _('Other')
    
    myth = models.ForeignKey(
        Myth, 
        on_delete=models.CASCADE, 
        related_name='evidences',
        verbose_name=_('myth')
    )
    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'))
    evidence_type = models.CharField(
        _('evidence type'), 
        max_length=30, 
        choices=EvidenceType.choices,
        default=EvidenceType.OTHER
    )
    source_url = models.URLField(_('source URL'), blank=True)
    source_citation = models.CharField(_('source citation'), max_length=500, blank=True)
    submitted_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='submitted_evidences',
        verbose_name=_('submitted by')
    )
    is_approved = models.BooleanField(_('is approved'), default=False)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('evidence')
        verbose_name_plural = _('evidences')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.get_evidence_type_display()}"


class Comment(models.Model):
    """User comments on myths."""
    myth = models.ForeignKey(
        Myth, 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name=_('myth')
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name=_('user')
    )
    content = models.TextField(_('content'))
    is_approved = models.BooleanField(_('is approved'), default=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('comment')
        verbose_name_plural = _('comments')
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.user.email} on {self.myth.title}"


class Vote(models.Model):
    """User votes on myths (upvote/downvote)."""
    class VoteType(models.TextChoices):
        UPVOTE = 'upvote', _('Upvote')
        DOWNVOTE = 'downvote', _('Downvote')
    
    myth = models.ForeignKey(
        Myth, 
        on_delete=models.CASCADE, 
        related_name='votes',
        verbose_name=_('myth')
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='votes',
        verbose_name=_('user')
    )
    vote_type = models.CharField(
        _('vote type'), 
        max_length=10, 
        choices=VoteType.choices
    )
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('vote')
        verbose_name_plural = _('votes')
        unique_together = ('myth', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} {self.get_vote_type_display()}d {self.myth.title}"


class ResearchRequest(models.Model):
    """Requests for research on specific myths."""
    class Status(models.TextChoices):
        OPEN = 'open', _('Open')
        IN_PROGRESS = 'in_progress', _('In Progress')
        COMPLETED = 'completed', _('Completed')
        REJECTED = 'rejected', _('Rejected')
    
    myth = models.ForeignKey(
        Myth, 
        on_delete=models.CASCADE, 
        related_name='research_requests',
        verbose_name=_('myth')
    )
    requested_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='research_requests',
        verbose_name=_('requested by')
    )
    assigned_to = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_research',
        verbose_name=_('assigned to')
    )
    status = models.CharField(
        _('status'), 
        max_length=20, 
        choices=Status.choices, 
        default=Status.OPEN
    )
    description = models.TextField(_('description'), blank=True)
    findings = models.TextField(_('findings'), blank=True)
    completed_at = models.DateTimeField(_('completed at'), null=True, blank=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('research request')
        verbose_name_plural = _('research requests')
        ordering = ['-created_at']

    def __str__(self):
        return f"Research on {self.myth.title} - {self.get_status_display()}"


class Notification(models.Model):
    """Notifications for users about updates on myths they're interested in."""
    class NotificationType(models.TextChoices):
        MYTH_UPDATE = 'myth_update', _('Myth Update')
        NEW_COMMENT = 'new_comment', _('New Comment')
        EVIDENCE_ADDED = 'evidence_added', _('New Evidence')
        RESEARCH_UPDATE = 'research_update', _('Research Update')
        STATUS_CHANGE = 'status_change', _('Status Change')
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='notifications',
        verbose_name=_('user')
    )
    notification_type = models.CharField(
        _('notification type'), 
        max_length=20, 
        choices=NotificationType.choices
    )
    title = models.CharField(_('title'), max_length=255)
    message = models.TextField(_('message'))
    is_read = models.BooleanField(_('is read'), default=False)
    related_myth = models.ForeignKey(
        Myth, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='notifications',
        verbose_name=_('related myth')
    )
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('notification')
        verbose_name_plural = _('notifications')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} - {self.user.email}"
