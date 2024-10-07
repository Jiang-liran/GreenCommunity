from django.urls import path
from .views import BusProxyView, CityListView

urlpatterns = [
    path('proxy/', BusProxyView.as_view(), name='bus_proxy'),
    path('cities/', CityListView.as_view(), name='city_list'),
]
