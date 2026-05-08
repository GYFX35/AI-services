import pytest
import json
from unittest.mock import patch

def test_automl_feature_engineering_endpoint(client, auth_headers):
    with patch('google_ai.provide_feature_engineering_assistance', return_value='Mocked FE response'):
        response = client.post('/api/v1/automl/feature-engineering',
                                data=json.dumps({'prompt': 'Test prompt'}),
                                content_type='application/json',
                                headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['message'] == 'Mocked FE response'

def test_automl_hyperparameter_tuning_endpoint(client, auth_headers):
    with patch('google_ai.provide_hyperparameter_tuning_assistance', return_value='Mocked Tuning response'):
        response = client.post('/api/v1/automl/hyperparameter-tuning',
                                data=json.dumps({'prompt': 'Test prompt'}),
                                content_type='application/json',
                                headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['message'] == 'Mocked Tuning response'

def test_automl_model_selection_endpoint(client, auth_headers):
    with patch('google_ai.provide_model_selection_assistance', return_value='Mocked Selection response'):
        response = client.post('/api/v1/automl/model-selection',
                                data=json.dumps({'prompt': 'Test prompt'}),
                                content_type='application/json',
                                headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['message'] == 'Mocked Selection response'

def test_automl_mlops_endpoint(client, auth_headers):
    with patch('google_ai.provide_mlops_assistance', return_value='Mocked MLOps response'):
        response = client.post('/api/v1/automl/mlops',
                                data=json.dumps({'prompt': 'Test prompt'}),
                                content_type='application/json',
                                headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['message'] == 'Mocked MLOps response'
