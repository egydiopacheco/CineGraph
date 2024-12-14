from django.db import models

class Individuo(models.Model):
    nome = models.CharField(max_length=100)
    idade = models.IntegerField()
    contato = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.nome
    
class Filme(models.Model):
    titulo_original = models.CharField(max_length=255)
    titulo_portugues = models.CharField(max_length=255)
    descricao = models.TextField()
    genero = models.CharField(max_length=255)
    diretor = models.CharField(max_length=255)
    elenco = models.CharField(max_length=255)
    duracao = models.IntegerField()
    lancamento = models.DateField()
    classificacao = models.CharField(max_length=255)

    def __str__(self):
        return self.titulo_original
    

class Genero(models.Model):
    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.nome