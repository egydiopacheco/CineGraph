from django.urls import path
from .views import project_info

urlpatterns = [
    path('api/project-info/', project_info, name='project_info'),
]
