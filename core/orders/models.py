from django.db import models
from users.models import CustomUser
from inventory.models import InventoryItem

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
    )
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name ='orders')
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    pickup_address = models.TextField()
    drop_address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL,null = True, blank = True, related_name='assigned_orders',limit_choices_to={'role': 'delivery'})
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} ({self.status})"