from django.contrib import admin
from django.urls import path
from SignLink import views  # 从 views 导入视图函数
from django.conf.urls import include
from users.views import register_view

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Home.urls')),                           # 默认首页
    path('SLClassroom/', include('SLClassroom.urls')),        # 手语教室
    path('LifeServing/', include('LifeServing.urls')),        # 生活服务
    path('Community/', include('Community.urls')),            # 社区
    path('Schedule/', include('Schedule.urls')),              # 日程
    path('MyPage/', include('MyPage.urls')),                  # 我的页面
    path('users/', include('users.urls')),                    # 用户
]

# 👇 添加这句以支持开发环境下媒体文件访问
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)