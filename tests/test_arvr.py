import pytest
from app import app, db, User

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_arvr_optimization_endpoint_no_api_key(client):
    response = client.post('/api/v1/arvr/optimization', json={'prompt': 'Optimize 3D models.'})
    assert response.status_code == 401

def test_arvr_optimization_endpoint_with_api_key(client, mocker):
    # Mocking user registration to get an API key
    user = User(username='testuser', api_key='testkey')
    db.session.add(user)
    db.session.commit()

    # Mocking the AI service call
    mocker.patch('google_ai.provide_arvr_optimization_assistance', return_value='Mocked AR/VR AI response')

    response = client.post('/api/v1/arvr/optimization',
                           json={'prompt': 'Optimize 3D models.'},
                           headers={'X-API-Key': 'testkey'})

    assert response.status_code == 200
    assert response.json['status'] == 'success'
    assert response.json['message'] == 'Mocked AR/VR AI response'

def test_arvr_optimization_endpoint_missing_prompt(client):
    user = User(username='testuser', api_key='testkey')
    db.session.add(user)
    db.session.commit()

    response = client.post('/api/v1/arvr/optimization',
                           json={},
                           headers={'X-API-Key': 'testkey'})

    assert response.status_code == 400
    assert 'error' in response.json
