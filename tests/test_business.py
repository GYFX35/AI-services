import pytest
import json
from unittest.mock import patch

@patch('google_ai.provide_monetization_advice')
def test_monetization_assistance(mock_gen, client, auth_headers):
    mock_gen.return_value = 'Mock monetization response'
    response = client.post('/api/v1/business/monetization',
                           data=json.dumps({'prompt': 'test monetization'}),
                           content_type='application/json',
                           headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Mock monetization response'

@patch('google_ai.provide_partnership_advice')
def test_partnership_assistance(mock_gen, client, auth_headers):
    mock_gen.return_value = 'Mock partnership response'
    response = client.post('/api/v1/business/partnership',
                           data=json.dumps({'prompt': 'test partnership'}),
                           content_type='application/json',
                           headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Mock partnership response'

@patch('google_ai.provide_fundraising_advice')
def test_fundraising_assistance(mock_gen, client, auth_headers):
    mock_gen.return_value = 'Mock fundraising response'
    response = client.post('/api/v1/business/fundraising',
                           data=json.dumps({'prompt': 'test fundraising'}),
                           content_type='application/json',
                           headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Mock fundraising response'

def test_create_subscription_checkout(client, auth_headers):
    with patch('stripe.checkout.Session.create') as mock_create, \
         patch.dict('os.environ', {'STRIPE_PREMIUM_PRICE_ID': 'price_test_123'}):
        mock_create.return_value.id = 'session_id'
        mock_create.return_value.url = 'https://stripe.com/checkout'

        response = client.post('/api/v1/payment/create-subscription-checkout',
                               data=json.dumps({'plan': 'premium'}),
                               content_type='application/json',
                               headers=auth_headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['url'] == 'https://stripe.com/checkout'
