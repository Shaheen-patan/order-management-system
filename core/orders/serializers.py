from rest_framework import serializers
from .models import Order
from inventory.models import InventoryItem
from inventory.serializers import InventoryItemSerializer 
from django.core.mail import send_mail
from django.conf import settings

class OrderSerializer(serializers.ModelSerializer):
    inventory_item = InventoryItemSerializer(read_only=True)  # for GET
    inventory_item_id = serializers.PrimaryKeyRelatedField(  # for POST/PATCH
        source='inventory_item',
        queryset=InventoryItem.objects.all(),
        write_only=True,
        required=False
    )
    class Meta:
        model = Order
        fields = ['id', 'title', 'pickup_address', 'drop_address', 'status',
                  'created_at', 'assigned_to', 'inventory_item', 'inventory_item_id']
        read_only_fields = ['status', 'created_at', 'assigned_to', 'inventory_item']

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    def validate_status(self, value):
            allowed = ['pending', 'dispatched', 'delivered']
            if value not in allowed:
                raise serializers.ValidationError("Invalid status")
            return value
    class Meta:
        model = Order
        fields = ['status']

class OrderAssignSerializer(serializers.ModelSerializer):
    def validate_assigned_to(self, value):
        if value.role != 'delivery':
            raise serializers.ValidationError("You can only assign to delivery staff.")
        return value
    class Meta:
        model = Order
        fields = ['assigned_to']

class OrderAssignInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['inventory_item']
    
    def update(self, instance, validated_data):
        item = validated_data.get('inventory_item')
        if item.quantity > 0:
            item.quantity -= 1
            item.save()

            # 🚨 Check for low stock and send email
            if item.is_low_stock():
                send_mail(
                    subject='🔔 Low Stock Alert',
                    message=f"Item '{item.name}' has low stock: only {item.quantity} left.",
                    from_email= settings.DEFAULT_FROM_EMAIL,
                    recipient_list=['shaheenpatan39@gmail.com',
                                    'patanshaheen725@gmail.com'],
                    fail_silently=False
                )
            instance.inventory_item = item
            instance.save()
            return instance
        else:
            raise serializers.ValidationError("Selected item is out of stock.")
    