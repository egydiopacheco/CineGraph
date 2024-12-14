from rest_framework import serializers
from .models import Individuo, Filme,Genero

class IndividuoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Individuo
        fields = '__all__'

class FilmeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filme
        fields = '__all__'

class GeneroSerializzer(serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = '__all__'