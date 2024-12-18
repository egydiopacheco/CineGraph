from django.http import JsonResponse
from owlready2 import get_ontology, default_world
import logging


logger = logging.getLogger(__name__)

ontology_path = "recommender/movie_ontology.rdf"
movie_onto = get_ontology(f"file://{ontology_path}").load()

def recommend_movies(request):
    search_query = request.GET.get('search_query', '').lower()
    genre_filter = request.GET.get('genre', '')
    release_date_filter = request.GET.get('release_date', '')

    sparql_query = """
    PREFIX : <http://example.org/movie_ontology#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?movie ?titlePtBr ?name ?genreLabel ?releaseDate ?description ?runtime ?directorName ?actorName
    WHERE {
        ?movie a :Movie .
        ?movie :name ?name .
        ?movie :titlePtBr ?titlePtBr .
        ?movie :description ?description .
        ?movie :runtime ?runtime .

        ?movie :hasGenre ?genreObj .
        ?genreObj rdfs:label ?genreLabel .

        OPTIONAL { ?movie :releaseDate ?releaseDate . }

        OPTIONAL {
            ?movie :hasDirector ?director .
            ?director :name ?directorName .
        }

        OPTIONAL {
            ?movie :hasActor ?actor .
            ?actor :name ?actorName .
        }

    """

    if search_query:
        sparql_query += f' FILTER(CONTAINS(LCASE(?name), "{search_query.lower()}")) .'

    if genre_filter:
        sparql_query += f' FILTER(LCASE(?genreLabel) = "{genre_filter.lower()}") .'

    if release_date_filter == "before 2000":
        sparql_query += ' FILTER(?releaseDate < "2000-01-01"^^xsd:date) .'

    sparql_query += " }"

    results = list(default_world.sparql(sparql_query))

    print(results)

    merged_results = {}

    for row in results:
        titlePtBr, name, genreLabel, releaseDate, description, runtime, directorName, actorName = row[1:]

        movie_key = titlePtBr
        if movie_key not in merged_results:
            merged_results[movie_key] = {
                "titlePtBr": titlePtBr,
                "title": name,
                "genre": genreLabel,
                "release_date": str(releaseDate) if releaseDate else None,
                "description": description,
                "runtime": runtime,
                "director": directorName,
                "cast": []
            }

        if actorName and actorName not in merged_results[movie_key]["cast"]:
            merged_results[movie_key]["cast"].append(actorName)

    recommendations = list(merged_results.values())
    return JsonResponse({"recommendations": recommendations})

def info_movies(request):
    try:
        sparql_query = """
        PREFIX : <http://example.org/movie_ontology#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?movie ?titlePtBr ?name ?genreLabel ?releaseDate ?description ?runtime ?directorName
        WHERE {
            ?movie a :Movie .
            ?movie :name ?name .
            ?movie :titlePtBr ?titlePtBr .
            ?movie :description ?description .
            ?movie :runtime ?runtime .
            ?movie :hasGenre ?genreObj .
            ?genreObj rdfs:label ?genreLabel .

            OPTIONAL { ?movie :releaseDate ?releaseDate . }
            OPTIONAL {
                ?movie :hasDirector ?director .
                ?director :name ?directorName .
            }
        }
        """

        results = list(default_world.sparql(sparql_query))

        movies = []

        for row in results:
            movie_data = {
                "title": row[1],
                "titlePtBr": row[2],
                "director": row[7],
                "genre": row[3],
                "release_date": str(row[4]) if row[4] else None,
                "description": row[5],
                "runtime": row[6]
            }
            movies.append(movie_data)

        amount = len(movies)

        return JsonResponse({"movies": movies, "amount": amount})

    except Exception as e:
        logger.error(f"Error occurred while fetching movie info: {e}")
        return JsonResponse({"error": "Internal Server Error"}, status=500)


def calculate_score(movie, weights):
    score = 0
    for attribute, weight in weights.items():
        score += weight * movie[attribute]
    return score

def rank_movies(movies_df, weights):
    movies_df['score'] = movies_df.apply(lambda movie: calculate_score(movie, weights), axis=1)
    ranked_movies = movies_df.sort_values(by='score', ascending=False)
    return ranked_movies