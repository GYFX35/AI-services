import pytest
import json
from unittest.mock import patch

def test_marketing_assistance_no_api_key(client):
    response = client.post('/api/v1/marketing/assistance',
                           data=json.dumps({'prompt': 'test prompt'}),
                           content_type='application/json')
    assert response.status_code == 401

@patch('google_ai.provide_marketing_bot_assistance')
def test_marketing_assistance_with_api_key(mock_gen, client, auth_headers):
    mock_gen.return_value = "Mock response for: How to do e-mail marketing?"
    response = client.post('/api/v1/marketing/assistance',
                           headers=auth_headers,
                           data=json.dumps({'prompt': 'How to do e-mail marketing?'}),
                           content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['message'] == "Mock response for: How to do e-mail marketing?"
