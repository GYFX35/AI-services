import pytest
from unittest.mock import patch

def test_military_assistance_endpoint(client, auth_headers):
    with patch('google_ai.provide_military_assistance') as mock_ai:
        mock_ai.return_value = "Military response"
        response = client.post('/api/v1/military/assistance',
                               json={'prompt': 'test military prompt'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Military response"

def test_gendarmerie_assistance_endpoint(client, auth_headers):
    with patch('google_ai.provide_gendarmerie_assistance') as mock_ai:
        mock_ai.return_value = "Gendarmerie response"
        response = client.post('/api/v1/gendarmerie/assistance',
                               json={'prompt': 'test gendarmerie prompt'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Gendarmerie response"

def test_police_assistance_endpoint(client, auth_headers):
    with patch('google_ai.provide_police_assistance') as mock_ai:
        mock_ai.return_value = "Police response"
        response = client.post('/api/v1/police/assistance',
                               json={'prompt': 'test police prompt'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Police response"

def test_security_optimization_endpoint(client, auth_headers):
    with patch('google_ai.provide_security_optimization_assistance') as mock_ai:
        mock_ai.return_value = "Security optimization response"
        response = client.post('/api/v1/security/optimization',
                               json={'prompt': 'test optimization prompt'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Security optimization response"

def test_malware_defense_endpoint(client, auth_headers):
    with patch('google_ai.provide_malware_defense_assistance') as mock_ai:
        mock_ai.return_value = "Malware defense response"
        response = client.post('/api/v1/malware-defense/assistance',
                               json={'prompt': 'test malware prompt'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Malware defense response"
