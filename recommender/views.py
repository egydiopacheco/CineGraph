from django.shortcuts import render
from rdflib import Graph, URIRef, Literal
from owlready2 import get_ontology, onto_path
from django.http import JsonResponse
from rest_framework import generics
from .models import Individuo
from .serializers import IndividuoSerializer

def project_info(request):
    ontology_path = "recommender/movie_ontology.owl"
    ontology = get_ontology(ontology_path).load()

    nodes = []
    for cls in ontology.classes():
        nodes.append({"id": cls.name, "label": cls.name})

    individuals = list(ontology.individuals())
    for ind in individuals:
        nodes.append({"id": ind.name, "label": ind.is_a[0].name})

    edges = []
    for prop in ontology.object_properties():
        for triple in prop.get_relations():
            edges.append({
                "source": triple[0].name,
                "target": triple[1].name,
                "relation": prop.name,
            })

    return JsonResponse({
        "project_name": "Movie Recommendation System",
        "ontology": {
            "nodes": nodes,
            "edges": edges,
        }
    })


class IndividuoCreateView(generics.CreateAPIView):
    queryset = Individuo.objects.all()
    serializer_class = IndividuoSerializer

class IndividuoListView(generics.ListAPIView):
    queryset = Individuo.objects.all()
    serializer_class = IndividuoSerializer

class IndividuoDetailView(generics.RetrieveAPIView):
    queryset = Individuo.objects.all()
    serializer_class = IndividuoSerializer

class IndividuoUpdateView(generics.UpdateAPIView):
    queryset = Individuo.objects.all()
    serializer_class = IndividuoSerializer

class IndividuoDeleteView(generics.DestroyAPIView):
    queryset = Individuo.objects.all()
    serializer_class = IndividuoSerializer