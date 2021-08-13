from re import search
from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response 

from .models import Task
from .serializer import TaskSerializer

class TaskAPI(APIView):

    def get_object(self, pk):
        try:
            return Task.objects.get(id=pk)
        except Task.DoesNotExist:
            return Http404 

    def get(self, request, pk=None, format=None):
        if pk:  
            task = self.get_object(pk)
            serialized = TaskSerializer(task)
            return Response(serialized.data)
        tasks = Task.objects.all().order_by("-id")
        serialized = TaskSerializer(tasks, many=True)
        return Response(serialized.data, status=status.HTTP_200_OK )

    def post(self, request, format=None):
        serialized = TaskSerializer(data = request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        return Response(serialized.errors)
        
    def put(self, request, pk, format=None):
        task = self.get_object(pk)
        serialized = TaskSerializer(task, data=request.data)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status = status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST )

    def delete(self, request, pk, format=None):
        task = self.get_object(pk)
        task.delete()
        return Response({'message':'Deleted successfully'})