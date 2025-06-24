from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='sl_classroom'),
]