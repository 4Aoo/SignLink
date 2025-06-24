from django.urls import re_path as url
from . import views
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path ('', views.post_list, name='community'),  # 首页就是帖子列表
    path('create_post/', views.create_post, name='create_post'),  # 专用于发布逻辑
    path ('post_list/', views.post_list, name='post_list'),  # 浏览已发布帖子
    path('like_post/<int:post_id>/', views.like_post, name='like_post'),  # 点赞帖子
    path('comment_post/<int:post_id>/', views.comment_post, name='comment_post'),  # 评论帖子
    path('favorite_post/<int:post_id>/', views.favorite_post, name='favorite_post'),  # 收藏帖子
    path('toggle_follow/<int:user_id>/', views.toggle_follow, name='toggle_follow'),  # 关注
]
