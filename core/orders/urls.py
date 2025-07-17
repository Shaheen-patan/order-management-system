from django.urls import path
from orders.views import CreateOrderView, CustomerOrderListView,AllOrdersView,UpdateOrderStatusView,AssignDeliveryView,AssignedOrdersView,AssignInventoryView

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('my/', CustomerOrderListView.as_view(), name='my-orders'),
    path('all/', AllOrdersView.as_view(), name='all-orders'),
    path('update/<int:pk>/', UpdateOrderStatusView.as_view(), name='update-order-status'),
    path('assign/<int:pk>/', AssignDeliveryView.as_view(), name='assign-delivery'),
    path('assigned/', AssignedOrdersView.as_view(), name='assigned-orders'),
    path('<int:pk>/assign-inventory/', AssignInventoryView.as_view(), name='assign-inventory'),


]
