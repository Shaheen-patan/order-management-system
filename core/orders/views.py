from rest_framework import generics, permissions
from orders.models import Order
from orders.serializers import OrderSerializer, OrderStatusUpdateSerializer, OrderAssignSerializer,OrderAssignInventorySerializer
from users.permissions import IsCustomer, IsAdminOrDelivery, IsAdmin, IsDeliveryStaff

class CreateOrderView(generics.CreateAPIView): #POST
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class CustomerOrderListView(generics.ListAPIView): #GET 
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsCustomer]

    def get_queryset(self):
        return Order.objects.filter(customer=self.request.user).order_by('-created_at')

class AllOrdersView(generics.ListAPIView): #GET
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrDelivery]
    
class UpdateOrderStatusView(generics.UpdateAPIView): #PATCH
    queryset = Order.objects.all()
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrDelivery]
    def get_queryset(self):
        user = self.request.user
        if user.role == 'delivery':
            return Order.objects.filter(assigned_to=user)
        return super().get_queryset()

class AssignDeliveryView(generics.UpdateAPIView): #PATCH
    queryset = Order.objects.all()
    serializer_class = OrderAssignSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class AssignedOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsDeliveryStaff]

    def get_queryset(self):
        return Order.objects.filter(assigned_to=self.request.user).order_by('-created_at')
    
class AssignInventoryView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderAssignInventorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
