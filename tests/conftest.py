import pytest
from app import app, db, User

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.app_context():
        db.create_all()
        # Use a more unique API key or check if user exists
        if not User.query.filter_by(username='testuser').first():
            test_user = User(username='testuser', api_key='testkey')
            db.session.add(test_user)
            db.session.commit()

        with app.test_client() as client:
            yield client

        db.session.remove()
        db.drop_all()

@pytest.fixture
def auth_headers():
    return {'X-API-Key': 'testkey'}
