from django.test import TestCase
from django.urls import reverse

class ProjectInfoTest(TestCase):
    def test_project_info_endpoint(self):
        url = reverse('project_info')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertIn('project_name', response.json())
        self.assertEqual(response.json()['project_name'], 'Movie Recommendation System')


