import pytest
from unittest.mock import patch

def test_togo_assistance_endpoint(client, auth_headers):
    with patch('google_ai.provide_togo_public_service_assistance') as mock_ai:
        mock_ai.return_value = "Togo Mocked response"
        response = client.post('/api/v1/togo/assistance',
                               json={'prompt': 'test togo prompt'},
                               headers=auth_headers)
        assert response.status_code == 200
        assert response.json['message'] == "Togo Mocked response"
