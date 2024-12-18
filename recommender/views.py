from django.http import JsonResponse
from owlready2 import get_ontology, default_world
import logging, random

logger = logging.getLogger(__name__)

ontology_path = "recommender/movie_ontology.rdf"
movie_onto = get_ontology(f"file://{ontology_path}").load()

def __build_base_sparql_query():
    """
    Build the base SPARQL query with common SELECT and WHERE clauses.

    Returns:
        str: Base SPARQL query template
    """
    return """
    PREFIX : <http://example.org/movie_ontology#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    SELECT ?movie ?titlePtBr ?name ?genreLabel ?releaseDate ?description ?runtime ?directorName ?actorName
    WHERE {
        ?movie a :Movie .
        ?movie :name ?name .
        OPTIONAL { ?movie :titlePtBr ?titlePtBr . }
        OPTIONAL { ?movie :description ?description . }
        OPTIONAL { ?movie :runtime ?runtime . }

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

def __apply_filters(sparql_query, filters):
    """
    Apply filters to the SPARQL query.

    Args:
        sparql_query (str): Base SPARQL query
        filters (dict): Filters to apply

    Returns:
        str: SPARQL query with applied filters
    """
    filter_mappings = {
        'genre': lambda value: f' FILTER(LCASE(?genreLabel) = "{value.lower()}") .',
        'director': lambda value: f' FILTER(LCASE(?directorName) = "{value.lower()}") .',
        'runtime': lambda value: f' FILTER(LCASE(?runtime) = "{value.lower()}") .',
        'search_query': lambda value: f' FILTER(CONTAINS(LCASE(?name), "{value.lower()}")) .',
        'release_date': lambda value: (
            ' FILTER(?releaseDate < "2000-01-01"^^xsd:date) .'
            if value == "before 2000" else ''
        )
    }

    for key, value in filters.items():
        if value and key in filter_mappings:
            sparql_query += filter_mappings[key](value)

    sparql_query += " }"
    return sparql_query

def __extract_movie_data(row):
    """
    Extract movie data from a SPARQL result row.

    Args:
        row (tuple): SPARQL query result row

    Returns:
        dict: Extracted movie data
    """
    return {
        "title": row[1],
        "titlePtBr": row[2],
        "director": row[7],
        "genre": row[3],
        "release_date": str(row[4]) if row[4] else None,
        "description": row[5],
        "runtime": row[6]
    }

def __get_initial_results(filters):
    """
    Get initial movie results based on filters.

    Args:
        filters (dict): Filters to apply

    Returns:
        list: List of movie results
    """
    sparql_query = __build_base_sparql_query()

    sparql_query = __apply_filters(sparql_query, filters)

    results = list(default_world.sparql(sparql_query))

    if not results:
        if filters.get('genre'):
            sparql_query_broad = __build_base_sparql_query()
            sparql_query_broad += f' FILTER(LCASE(?genreLabel) = "{filters["genre"].lower()}") .'
            sparql_query_broad += " }"
            results = list(default_world.sparql(sparql_query_broad))

    return results

def recommend_movies(request):
    """
    Recommend top 3 movies based on user request parameters.

    Args:
        request: Django request object

    Returns:
        JsonResponse: Top recommended movies
    """
    try:
        filters = {
            'search_query': request.GET.get('search_query', '').lower(),
            'genre': request.GET.get('genre', ''),
            'director': request.GET.get('director', ''),
            'runtime': request.GET.get('runtime', ''),
            'release_date': request.GET.get('release_date', '')
        }

        filters = {k: v for k, v in filters.items() if v}

        results = __get_initial_results(filters)

        scores = {}
        for row in results:
            movie_data = __extract_movie_data(row)
            score = __calculate_score(movie_data, filters)
            scores[movie_data["title"]] = score

        noisy_scores = __add_noise_to_scores(scores)
        top_movies = __get_top_movies(noisy_scores)

        top_movies_response = [
            {"title": movie[0], "score": movie[1]}
            for movie in top_movies
        ]

        return JsonResponse({"top_movies": top_movies_response})

    except Exception as e:
        logger.error(f"Error occurred while recommending a movie: {e}")
        return JsonResponse({"error": "Internal Server Error"}, status=500)

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