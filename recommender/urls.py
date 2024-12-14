from django.urls import path
from .views import project_info
from django.urls import path
from .views import IndividuoCreateView, IndividuoListView, IndividuoDetailView, IndividuoUpdateView, IndividuoDeleteView

urlpatterns = [
    path('api/project-info/', project_info, name='project_info'),
]

urlpatterns = [
    path('individuos/create', IndividuoCreateView.as_view(), name='individuo-create'),
    path('individuos/', IndividuoListView.as_view(), name='individuo-list'),
    path('individuos/<int:pk>/', IndividuoDetailView.as_view(), name='individuo-detail'),
    path('individuos/<int:pk>/update/', IndividuoUpdateView.as_view(), name='individuo-update'),
    path('individuos/<int:pk>/delete/', IndividuoDeleteView.as_view(), name='individuo-delete'),
]