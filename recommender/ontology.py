from owlready2 import *

ontology_path = "./movie_ontology.rdf"

def check_ontology_consistency(ontology_path):
    onto = get_ontology(ontology_path).load()

    try:
        with onto:
            #sync_reasoner_hermit(ignore_unsupported_datatypes = True)
            sync_reasoner_pellet()

        print("Ontology is consistent!")
        return True

    except OwlReadyInconsistentOntologyError:
        print("Ontology is INCONSISTENT!")

        with onto:
            try:
                inconsistent_classes = list(default_world.inconsistent_classes())
                print("\nInconsistent Classes:")
                for cls in inconsistent_classes:
                    print(f"- {cls}")
            except Exception as e:
                print(f"Could not retrieve inconsistent classes: {e}")

        return False
    except Exception as e:
        print(f"An error occurred during consistency checking: {e}")
        return False

def detailed_ontology_analysis(ontology_path):
    onto = get_ontology(ontology_path).load()

    Movie = onto.search_one(iri="*Movie")
    Genre = onto.search_one(iri="*Genre")
    Person = onto.search_one(iri="*Person")

    movies = list(Movie.instances())
    genres = list(Genre.instances())
    persons = list(Person.instances())

    for person in persons:
        print(person.name)


    print("Ontology Analysis:")
    print("------------------")

    print("\nClasses:")
    for cls in onto.classes():
        print(f"- {cls.name}")

    print("\nObject Properties:")
    for prop in onto.object_properties():
        print(f"- {prop.name}")

    print("\nData Properties:")
    for prop in onto.data_properties():
        print(f"- {prop.name}")

    print("\nIndividuals:")
    for ind in onto.individuals():
        print(f"- {ind.name}")

check_ontology_consistency(ontology_path)
detailed_ontology_analysis(ontology_path)

