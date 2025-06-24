from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser
from MyPage.models import UserProfile

# 注册时同时创建userprofile
@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)