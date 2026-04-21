import pytest
import json
from unittest.mock import patch, MagicMock

def test_conflict_debug_assistance_endpoint(client, auth_headers):
    """Test the conflict-debug assistance endpoint."""
    mock_response = "Root cause identified: Merge conflict in requirements.txt. Fix: Manually resolve and run pip install."

    with patch('google_ai.provide_conflict_debug_assistance', return_value=mock_response):
        response = client.post(
            '/api/v1/conflict-debug/assistance',
            data=json.dumps({'prompt': 'How to resolve a git merge conflict?'}),
            content_type='application/json',
            headers=auth_headers
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert data['message'] == mock_response

def test_conflict_debug_assistance_no_prompt(client, auth_headers):
    """Test the conflict-debug assistance endpoint without a prompt."""
    response = client.post(
        '/api/v1/conflict-debug/assistance',
        data=json.dumps({}),
        content_type='application/json',
        headers=auth_headers
    )

    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
