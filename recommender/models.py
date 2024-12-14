from django.db import models

class Individuo(models.Model):
    nome = models.CharField(max_length=100)
    idade = models.IntegerField()
    contato = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.nome