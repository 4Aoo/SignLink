from django.db import models
from django.conf import settings
from Community.models import Post  # 假设帖子模型在 Community 应用中
from django.contrib.auth import get_user_model

User = get_user_model()


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, verbose_name="个人简介")
    personal_background = models.ImageField(upload_to='personal_backgrounds/', blank=True, null=True, 
                                            verbose_name="个人资料背景", default='personal_backgrounds/default.png')
    page_background = models.ImageField(upload_to='page_backgrounds/', blank=True, null=True, 
                                        verbose_name="页面背景", default='page_backgrounds/default.png')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} 的个人资料"

    def get_user_posts(self):
        return Post.objects.filter(user=self.user).order_by('-created_at')


class Follow(models.Model):
    """用于记录用户之间的关注关系"""
    follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    followed = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.follower.username} 关注了 {self.following.username}"
