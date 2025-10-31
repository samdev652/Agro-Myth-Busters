from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Creates a superuser with default credentials'

    def handle(self, *args, **options):
        User = get_user_model()
        
        if not User.objects.filter(email='admin@example.com').exists():
            User.objects.create_superuser(
                email='admin@example.com',
                first_name='Admin',
                last_name='User',
                password='admin123',
                is_active=True,
                is_staff=True,
                is_superuser=True,
                is_farmer=False,
                is_researcher=True
            )
            self.stdout.write(self.style.SUCCESS('Successfully created superuser'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists'))
