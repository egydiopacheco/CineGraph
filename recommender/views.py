from django.http import JsonResponse
from owlready2 import get_ontology, default_world
import logging, random

logger = logging.getLogger(__name__)

ontology_path = "recommender/movie_ontology.rdf"
movie_onto = get_ontology(f"file://{ontology_path}").load()

def recommend_movies(request):
    """
    Given a request with some movie parameters, recommend top 3 movies to the user
    """
    search_query = request.GET.get('search_query', '').lower()
    genre_filter = request.GET.get('genre', '')
    director_filter = request.GET.get('director', '')
    runtime_filter = request.GET.get('runtime', '')
    release_date_filter = request.GET.get('release_date', '')

    filters = {}
    if genre_filter:
        filters['genre'] = genre_filter
    if director_filter:
        filters['director'] = director_filter
    if runtime_filter:
        filters['runtime'] = runtime_filter
    if release_date_filter:
        filters['release_date'] = release_date_filter

    print(filters)
    print(__calculate_weight_map(filters))

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

    if director_filter:
        sparql_query += f' FILTER(LCASE(?directorName) = "{director_filter.lower()}") .'

    if runtime_filter:
        sparql_query += f' FILTER(LCASE(?runtime) = "{runtime_filter.lower()}") .'

    if release_date_filter == "before 2000":
        sparql_query += ' FILTER(?releaseDate < "2000-01-01"^^xsd:date) .'

    sparql_query += " }"

    results = list(default_world.sparql(sparql_query))

    scores = {}

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
        score = __calculate_score(movie_data, filters)
        print(score)
        scores[movie_data["title"]] = score

    print(scores)
    noisy_scores = __add_noise_to_scores(scores)
    print(noisy_scores)

    top_movies = __get_top_movies(noisy_scores)
    top_movies_response = [{"title": movie[0], "score": movie[1]} for movie in top_movies]
    print(top_movies_response)
    return JsonResponse({"top_movies": top_movies_response})

    """
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
    """

def info_movies(request):
    """
    Return all information about movies in the ontology
    """
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


def __calculate_weight_map(filters):
    weight_map = {
        'genre': 0.4,
        'director': 0.3,
        'runtime': 0.15,
        'release_date': 0.15,
    }

    if filters:
        for filter_key in filters:
            if filter_key in weight_map:
                weight_map[filter_key] += 0.1

        total_weight = sum(weight_map.values())
        for key in weight_map:
            weight_map[key] /= total_weight
    else:
        return weight_map

    return weight_map

def __add_noise_to_scores(scores):
    adjusted_scores = {}
    for movie, score in scores.items():
        noise = random.normalvariate(0, 0.05)
        adjusted_score = max(0, score + noise)
        adjusted_scores[movie] = adjusted_score

    return adjusted_scores

def __calculate_score(movie, filters):
    weight_map = __calculate_weight_map(filters)

    score = 0

    if movie['genre'] == filters.get('genre'):
        score += weight_map['genre']

    if movie['director'] == filters.get('director'):
        score += weight_map['director']

    if movie['runtime'] == filters.get('runtime'):
        score += weight_map['runtime']

    if movie['release_date'] == filters.get('release_date'):
        score += weight_map['release_date']

    return score

def __get_top_movies(scores, n=3):
    sorted_movies = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_movies[:n]