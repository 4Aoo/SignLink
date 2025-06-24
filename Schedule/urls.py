# Schedule/urls.py
from django.urls import path
from .views import (
    EventListCreateView, EventDetailView, ScheduleView,
    TaskListCreateView, TaskToggleCompleteView, TaskDeleteView,
    TodayEventsView
)

urlpatterns = [
    # 事件API
    path('events/', EventListCreateView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('events/today/', TodayEventsView.as_view(), name='today-events'),
    
    # 任务API
    path('tasks/', TaskListCreateView.as_view(), name='task-list'),
    path('tasks/<int:pk>/toggle/', TaskToggleCompleteView.as_view(), name='task-toggle'),
    path('tasks/<int:pk>/delete/', TaskDeleteView.as_view(), name='task-delete'),
    path('', ScheduleView.as_view(), name='schedule'),  
]