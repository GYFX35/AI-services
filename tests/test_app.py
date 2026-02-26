import pytest
import json
from unittest.mock import patch

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200

def test_config(client):
    response = client.get('/api/config')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'stripePublicKey' in data

def test_register(client):
    response = client.post('/api/register',
                           data=json.dumps({'username': 'newuser'}),
                           content_type='application/json')
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['username'] == 'newuser'
    assert 'api_key' in data

def test_me_authorized(client, auth_headers):
    response = client.get('/api/me', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['username'] == 'testuser'

def test_me_unauthorized(client):
    response = client.get('/api/me')
    assert response.status_code == 401

@patch('google_ai.generate_website')
def test_develop_website(mock_gen, client, auth_headers):
    mock_gen.return_value = ('<html></html>', 'body {}')
    response = client.post('/api/v1/develop/website',
                           data=json.dumps({'prompt': 'test website'}),
                           content_type='application/json',
                           headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'index.html' in data['message']

def test_weather_no_key(client, auth_headers):
    # This might return the error message defined in get_weather
    response = client.post('/api/v1/weather',
                           data=json.dumps({'location': 'London'}),
                           content_type='application/json',
                           headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'Error' in data['message'] or 'Weather in' in data['message']
