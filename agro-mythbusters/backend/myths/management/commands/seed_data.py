from django.core.management.base import BaseCommand
from myths.models import Category, Myth
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with initial categories and sample myths'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create categories
        categories_data = [
            {
                'name': 'Fertilizers',
                'description': 'Myths related to fertilizer use and application',
                'icon': 'science'
            },
            {
                'name': 'Organic Farming',
                'description': 'Myths about organic farming practices and yields',
                'icon': 'eco'
            },
            {
                'name': 'GMOs',
                'description': 'Myths surrounding genetically modified organisms',
                'icon': 'biotech'
            },
            {
                'name': 'Soil Management',
                'description': 'Myths about soil health and management practices',
                'icon': 'terrain'
            },
            {
                'name': 'Pest Control',
                'description': 'Myths related to pest and disease management',
                'icon': 'bug_report'
            },
            {
                'name': 'Water Management',
                'description': 'Myths about irrigation and water usage',
                'icon': 'water_drop'
            },
            {
                'name': 'Crop Rotation',
                'description': 'Myths about crop rotation and diversity',
                'icon': 'autorenew'
            },
            {
                'name': 'Livestock',
                'description': 'Myths related to livestock farming',
                'icon': 'pets'
            },
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': cat_data['description'],
                    'icon': cat_data['icon']
                }
            )
            categories[cat_data['name']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
            else:
                self.stdout.write(f'Category already exists: {category.name}')

        # Create sample myths
        myths_data = [
            {
                'title': 'Chemical Fertilizers Always Increase Crop Yield',
                'description': 'There is a common belief that applying more chemical fertilizers always leads to higher crop yields. However, excessive use can lead to soil degradation, water pollution, and diminishing returns. The relationship between fertilizer application and yield is complex and depends on soil health, crop type, weather conditions, and proper application techniques.',
                'origin': 'Agricultural commercialization period',
                'category': 'Fertilizers',
                'status': 'debunked'
            },
            {
                'title': 'Organic Farming Cannot Feed the World',
                'description': 'Critics often claim that organic farming yields are too low to meet global food demands. However, research shows that organic farming, especially in developing countries, can match or exceed conventional yields when proper techniques are used. The debate is more nuanced, involving sustainability, soil health, and long-term food security.',
                'origin': 'Industrial agriculture advocacy',
                'category': 'Organic Farming',
                'status': 'verified'
            },
            {
                'title': 'All GMOs Are Harmful to Human Health',
                'description': 'A widespread myth suggests that all genetically modified organisms are dangerous for consumption. Scientific consensus indicates that GMOs approved for commercial use undergo rigorous testing and are safe to eat. However, concerns about biodiversity, corporate control, and environmental impact remain valid topics for discussion.',
                'origin': 'Anti-GMO movements',
                'category': 'GMOs',
                'status': 'debunked'
            },
            {
                'title': 'Tilling Soil is Always Necessary for Good Crop Growth',
                'description': 'Traditional wisdom holds that plowing or tilling is essential for preparing soil for planting. Modern research shows that no-till or reduced-till farming can improve soil structure, increase organic matter, reduce erosion, and maintain beneficial soil organisms. The practice depends on specific soil conditions and crops.',
                'origin': 'Traditional farming practices',
                'category': 'Soil Management',
                'status': 'under_review'
            },
            {
                'title': 'Monoculture Farming is More Efficient',
                'description': 'Many believe that growing a single crop over large areas is the most efficient farming method. While it may simplify operations, monoculture increases vulnerability to pests and diseases, depletes specific soil nutrients, and reduces biodiversity. Crop rotation and polyculture often prove more sustainable long-term.',
                'origin': 'Industrial agriculture',
                'category': 'Crop Rotation',
                'status': 'debunked'
            },
            {
                'title': 'Pesticides Are the Only Effective Pest Control',
                'description': 'The belief that chemical pesticides are the only reliable method for pest control overlooks integrated pest management (IPM) strategies. IPM combines biological controls, crop rotation, resistant varieties, and targeted pesticide use, often achieving better long-term results with fewer environmental impacts.',
                'origin': 'Chemical industry marketing',
                'category': 'Pest Control',
                'status': 'debunked'
            },
            {
                'title': 'More Water Always Means Better Crop Growth',
                'description': 'While adequate water is essential, excessive irrigation can lead to waterlogging, nutrient leaching, increased disease, and water waste. Proper water management considers soil type, crop needs, growth stage, and climate conditions. Deficit irrigation strategies can sometimes improve crop quality.',
                'origin': 'Traditional farming wisdom',
                'category': 'Water Management',
                'status': 'debunked'
            },
            {
                'title': 'Antibiotics in Livestock Do Not Affect Humans',
                'description': 'Some argue that antibiotic use in livestock farming does not impact human health. However, evidence shows that overuse of antibiotics in animals contributes to antibiotic resistance in bacteria that can infect humans, posing a significant public health concern. Responsible antibiotic stewardship in agriculture is crucial.',
                'origin': 'Livestock industry',
                'category': 'Livestock',
                'status': 'verified'
            },
        ]

        for myth_data in myths_data:
            category = categories.get(myth_data.pop('category'))
            myth, created = Myth.objects.get_or_create(
                title=myth_data['title'],
                defaults={
                    **myth_data,
                    'category': category,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created myth: {myth.title}'))
            else:
                self.stdout.write(f'Myth already exists: {myth.title}')

        self.stdout.write(self.style.SUCCESS('Database seeding completed!'))
