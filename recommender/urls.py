from django.urls import path
from .views import recommend_movies, info_movies

urlpatterns = [
    path('recommendations/', recommend_movies, name='recommend_movies'),
    path('info/', info_movies, name='info_movies' )
]

