import pytest
from app import app, db, User
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_marketing_assistance_no_api_key(client):
    response = client.post('/api/v1/marketing/assistance',
                           data=json.dumps({'prompt': 'test prompt'}),
                           content_type='application/json')
    assert response.status_code == 401

def test_marketing_assistance_with_api_key(client):
    with app.app_context():
        user = User(username='testuser', api_key='testkey')
        db.session.add(user)
        db.session.commit()

    # Mocking google_ai.provide_marketing_bot_assistance to avoid Vertex AI calls during tests
    import google_ai
    original_func = google_ai.provide_marketing_bot_assistance
    google_ai.provide_marketing_bot_assistance = lambda prompt: f"Mock response for: {prompt}"

    try:
        response = client.post('/api/v1/marketing/assistance',
                               headers={'X-API-Key': 'testkey'},
                               data=json.dumps({'prompt': 'How to do e-mail marketing?'}),
                               content_type='application/json')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'success'
        assert "Mock response for: How to do e-mail marketing?" in data['message']
    finally:
        google_ai.provide_marketing_bot_assistance = original_func
