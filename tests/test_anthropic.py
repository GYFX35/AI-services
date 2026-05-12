import pytest
import json

def test_anthropic_intelligence(client, auth_headers):
    response = client.post('/api/v1/anthropic/intelligence',
                           data=json.dumps({'prompt': 'What is the future of AI?'}),
                           headers=auth_headers,
                           content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert 'message' in data

def test_anthropic_coding(client, auth_headers):
    response = client.post('/api/v1/anthropic/coding',
                           data=json.dumps({'prompt': 'Write a hello world in Python.'}),
                           headers=auth_headers,
                           content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert 'message' in data
