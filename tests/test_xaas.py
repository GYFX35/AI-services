import pytest
from unittest.mock import patch

@patch('google_ai.provide_iaas_assistance')
def test_iaas_assistance_endpoint(mock_ai, client, auth_headers):
    mock_ai.return_value = "Mock IaaS response"
    response = client.post('/api/v1/iaas/assistance',
                           json={'prompt': 'How to setup a VM?'},
                           headers=auth_headers)
    assert response.status_code == 200
    assert response.json['message'] == "Mock IaaS response"

@patch('google_ai.provide_paas_assistance')
def test_paas_assistance_endpoint(mock_ai, client, auth_headers):
    mock_ai.return_value = "Mock PaaS response"
    response = client.post('/api/v1/paas/assistance',
                           json={'prompt': 'How to deploy an app?'},
                           headers=auth_headers)
    assert response.status_code == 200
    assert response.json['message'] == "Mock PaaS response"

@patch('google_ai.provide_saas_assistance')
def test_saas_assistance_endpoint(mock_ai, client, auth_headers):
    mock_ai.return_value = "Mock SaaS response"
    response = client.post('/api/v1/saas/assistance',
                           json={'prompt': 'What is SaaS?'},
                           headers=auth_headers)
    assert response.status_code == 200
    assert response.json['message'] == "Mock SaaS response"

@patch('google_ai.provide_itaas_assistance')
def test_itaas_assistance_endpoint(mock_ai, client, auth_headers):
    mock_ai.return_value = "Mock ITaaS response"
    response = client.post('/api/v1/itaas/assistance',
                           json={'prompt': 'How to use ITaaS?'},
                           headers=auth_headers)
    assert response.status_code == 200
    assert response.json['message'] == "Mock ITaaS response"
