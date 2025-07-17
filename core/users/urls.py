from django.urls import path
from users.views import RegisterView, DeliveryUserListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name = 'register'),
    path('delivery/', DeliveryUserListView.as_view(), name='delivery-users'),
]

