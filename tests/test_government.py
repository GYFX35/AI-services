import pytest
from unittest.mock import patch

def test_government_assistance_endpoint(client, auth_headers):
    with patch('google_ai.provide_government_assistance') as mock_ai:
        mock_ai.return_value = "Mocked response"
        response = client.post('/api/v1/government/assistance',
                               json={'prompt': 'test prompt'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Mocked response"

def test_public_policy_endpoint(client, auth_headers):
    with patch('google_ai.provide_public_policy_assistance') as mock_ai:
        mock_ai.return_value = "Policy advice"
        response = client.post('/api/v1/government/policy',
                               json={'prompt': 'policy issue'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Policy advice"

def test_citizen_engagement_endpoint(client, auth_headers):
    with patch('google_ai.provide_citizen_engagement_assistance') as mock_ai:
        mock_ai.return_value = "Engagement strategy"
        response = client.post('/api/v1/government/engagement',
                               json={'prompt': 'engagement prompt'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Engagement strategy"

def test_smart_city_endpoint(client, auth_headers):
    with patch('google_ai.provide_smart_city_assistance') as mock_ai:
        mock_ai.return_value = "Smart city plan"
        response = client.post('/api/v1/government/smart-city',
                               json={'prompt': 'smart city prompt'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Smart city plan"
