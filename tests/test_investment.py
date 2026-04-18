import pytest
from app import db, User
import google_ai

def test_investment_assistance_endpoint(client, auth_headers):
    """Test the investment trading assistance endpoint."""
    # Mocking google_ai.provide_investment_trading_assistance to avoid Vertex AI calls
    original_func = google_ai.provide_investment_trading_assistance
    google_ai.provide_investment_trading_assistance = lambda prompt: f"Mock investment response for: {prompt}"

    try:
        response = client.post('/api/v1/investment-trading/assistance',
                               json={'prompt': 'How to optimize my portfolio?'},
                               headers=auth_headers)
        assert response.status_code == 200
        data = response.get_json()
        assert data['status'] == 'success'
        assert "Mock investment response for: How to optimize my portfolio?" in data['message']
    finally:
        google_ai.provide_investment_trading_assistance = original_func

def test_investment_assistance_no_prompt(client, auth_headers):
    """Test the investment trading assistance endpoint with no prompt."""
    response = client.post('/api/v1/investment-trading/assistance',
                           json={},
                           headers=auth_headers)
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
