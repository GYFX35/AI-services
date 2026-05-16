import pytest
from unittest.mock import patch

@patch('google_ai.provide_autogpt_assistance')
def test_autogpt_assistance_endpoint(mock_gen, client, auth_headers):
    """Test the AutoGPT assistance endpoint."""
    mock_gen.return_value = 'Mock autogpt response'
    response = client.post('/api/v1/autogpt/assistance',
                           json={'prompt': 'Plan a world tour'},
                           headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert data['message'] == 'Mock autogpt response'

def test_autogpt_assistance_no_prompt(client, auth_headers):
    """Test the AutoGPT assistance endpoint without prompt."""
    response = client.post('/api/v1/autogpt/assistance',
                           json={},
                           headers=auth_headers)
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
