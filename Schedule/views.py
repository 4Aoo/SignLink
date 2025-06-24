# schedule/views.py
from rest_framework import generics, status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.views import APIView # type: ignore
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Event, Task
from .serializers import EventSerializer, TaskSerializer
from django.shortcuts import render
from django.views.generic import TemplateView

class EventListCreateView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # 获取日期范围参数
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        queryset = Event.objects.filter(user=self.request.user)
        
        # 如果提供了日期范围，进行过滤
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        
        # 按日期和时间排序
        return queryset.order_by('date', 'time')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # 如果提供了date参数，过滤当天的任务
        date = self.request.query_params.get('date')
        if date:
            return Task.objects.filter(user=self.request.user, event__date=date)
        # 默认返回所有任务
        return Task.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # 如果请求中包含event_id，关联到对应的事件
        event_id = self.request.data.get('event')
        if event_id:
            try:
                event = Event.objects.get(id=event_id, user=self.request.user)
                serializer.save(user=self.request.user, event=event)
            except Event.DoesNotExist:
                return Response({"error": "Event not found"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer.save(user=self.request.user)

class TaskToggleCompleteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        task = get_object_or_404(Task, id=pk, user=request.user)
        task.completed = not task.completed
        task.save()
        serializer = TaskSerializer(task)
        return Response(serializer.data)

class TaskDeleteView(generics.DestroyAPIView):
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

class TodayEventsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        today = timezone.now().date()
        events = Event.objects.filter(user=request.user, date=today)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

class ScheduleView(TemplateView):
    template_name = 'Schedule.html'

