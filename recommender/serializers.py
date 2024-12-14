from rest_framework import serializers
from .models import Individuo

class IndividuoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Individuo
        fields = '__all__'