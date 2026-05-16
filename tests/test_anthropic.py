import pytest
import json
from unittest.mock import patch

@patch('google_ai.provide_claude_intelligence')
def test_anthropic_intelligence(mock_gen, client, auth_headers):
    mock_gen.return_value = 'Mock intelligence response'
    response = client.post('/api/v1/anthropic/intelligence',
                           data=json.dumps({'prompt': 'What is the future of AI?'}),
                           headers=auth_headers,
                           content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['message'] == 'Mock intelligence response'

@patch('google_ai.provide_claude_coding_assistance')
def test_anthropic_coding(mock_gen, client, auth_headers):
    mock_gen.return_value = 'Mock coding response'
    response = client.post('/api/v1/anthropic/coding',
                           data=json.dumps({'prompt': 'Write a hello world in Python.'}),
                           headers=auth_headers,
                           content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['message'] == 'Mock coding response'
