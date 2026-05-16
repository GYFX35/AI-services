import pytest
import json
from unittest.mock import patch

@patch('google_ai.provide_digital_ecosystem_assistance')
def test_digital_ecosystem_assistance(mock_gen, client, auth_headers):
    mock_gen.return_value = 'Mock digital ecosystem response'
    response = client.post('/api/v1/digital-ecosystem/assistance',
                           data=json.dumps({'prompt': 'test digital ecosystem'}),
                           content_type='application/json',
                           headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Mock digital ecosystem response'
