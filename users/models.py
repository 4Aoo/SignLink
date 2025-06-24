from django.db import models
from django.conf import settings  
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # 基础字段（已继承 username、email、password 等）
    avatar = models.ImageField(
        upload_to='avatars/',
        verbose_name="头像",
        blank=True,
        null=True,
        default='avatars/default_avatar.png'  # ✅ 指定默认图片路径
    )
    agreed_terms = models.BooleanField(default=False, verbose_name="同意条款")
    activation_token = models.CharField(max_length=40, blank=True)  # 激活令牌字段

    
    class Meta:
        verbose_name = "用户"
        verbose_name_plural = "用户管理"

    def __str__(self):
        return self.username

# Create your models here.
