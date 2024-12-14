from django.urls import path
from .views import project_info
from django.urls import path
from .views import IndividuoCreateView, IndividuoListView,GeneroCreateView,GeneroListView
from . import views

urlpatterns = [
    path('api/project-info/', project_info, name='project_info'),
]

urlpatterns = [
    path('individuos/create', IndividuoCreateView.as_view(), name='individuo-create'),
    path('individuos/', IndividuoListView.as_view(), name='individuo-list'),
    path('atores/', IndividuoListView.as_view(), name='actors-list'),
    path('diretores/', IndividuoListView.as_view(), name='directors-list'),
    path('filmes/', views.FilmeListView.as_view(), name='filme_list'),
    path('filmes/recomendados', views.FilmeListView.as_view(), name='recomended_filme_list'),
    path('filmes/create/', views.FilmeCreateView.as_view(), name='filme_create'),
    path('generos/', views.GeneroListView.as_view(), name='genero_list'),
    path('genero/create/', views.GeneroCreateView.as_view(), name='genero_create'),
]