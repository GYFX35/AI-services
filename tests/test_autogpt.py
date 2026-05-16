import pytest
from app import app, db, User

def test_autogpt_assistance_endpoint(client, auth_headers, mocker):
    """Test the AutoGPT assistance endpoint."""
    mocker.patch('google_ai.provide_autogpt_assistance', return_value='Mocked AutoGPT response')
    response = client.post('/api/v1/autogpt/assistance',
                           json={'prompt': 'Plan a world tour'},
                           headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert 'message' in data

def test_autogpt_assistance_no_prompt(client, auth_headers):
    """Test the AutoGPT assistance endpoint without prompt."""
    response = client.post('/api/v1/autogpt/assistance',
                           json={},
                           headers=auth_headers)
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
