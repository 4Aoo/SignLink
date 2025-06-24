# schedule/serializers.py
from rest_framework import serializers # type: ignore
from .models import Event, Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'text', 'completed', 'created_at', 'event']

class EventSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'date', 'time', 'description', 'created_at', 'tasks']