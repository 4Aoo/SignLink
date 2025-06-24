from django.urls import path
from . import views

urlpatterns = [
    path('', views.my_page_view, name='my_page'),
    path('upload-avatar/', views.upload_avatar, name='upload_avatar'),
    path('upload-banner/', views.upload_banner, name='upload_banner'),
    path('upload-pagebg/', views.upload_page_background, name='upload_pagebg'),
    path('delete_post/<int:post_id>/', views.delete_post, name='delete_post'),
]
