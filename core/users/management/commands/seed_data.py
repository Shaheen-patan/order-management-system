from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from orders.models import Order
from inventory.models import InventoryItem
from django.utils import timezone
import random

User = get_user_model()

class Command(BaseCommand):
    help = "Seed database with sample users, inventory, and orders"

    def handle(self, *args, **kwargs):
        # USERS
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(username="admin", password="adminpass", role="admin")
        if not User.objects.filter(username="customer1").exists():
            User.objects.create_user(username="customer1", password="custpass", role="customer")
        if not User.objects.filter(username="customer2").exists():
            User.objects.create_user(username="customer2", password="custpass", role="customer")
        if not User.objects.filter(username="delivery1").exists():
            User.objects.create_user(username="delivery1", password="delpass", role="delivery")
        if not User.objects.filter(username="delivery2").exists():
            User.objects.create_user(username="delivery2", password="delpass", role="delivery")

        customers = User.objects.filter(role="customer")
        delivery_staff = list(User.objects.filter(role="delivery"))

        # INVENTORY
        item_names = ["Phone", "Laptop", "Tablet", "TV", "Router", "Printer"]
        for name in item_names:
            InventoryItem.objects.get_or_create(
                name=name,
                defaults={"description": f"{name} item", "quantity": random.randint(5, 15)}
            )

        items = list(InventoryItem.objects.all())

        # ORDERS
        for i in range(10):
            order = Order.objects.create(
                title=f"Order {i+1}",
                pickup_address="Warehouse A",
                drop_address=f"Location {i+1}",
                customer=random.choice(customers),
                status=random.choice(["pending", "delivered"]),
                created_at=timezone.now(),
            )
            if random.choice([True, False]):
                order.assigned_to = random.choice(delivery_staff)
            if random.choice([True, False]):
                order.inventory_item = random.choice(items)
            order.save()

        self.stdout.write(self.style.SUCCESS("✅ Sample data created successfully."))
