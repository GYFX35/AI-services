import axios from 'axios';

const API_BASE_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['X-API-Key'] = token;
  } else {
    delete apiClient.defaults.headers.common['X-API-Key'];
  }
};

export const aiService = {
  generateWebsite: (prompt) => apiClient.post('/develop/website', { prompt }),
  debugCode: (prompt) => apiClient.post('/debug', { prompt }),
  generateSocialPost: (prompt) => apiClient.post('/market/post', { prompt }),
  getWeather: (location) => apiClient.post('/weather', { location }),
  getFinancialAdvice: (prompt) => apiClient.post('/finance/advice', { prompt }),
  // Add more as needed based on app.py routes
};

export const userService = {
  register: (username) => axios.post('/api/register', { username }),
  getMe: () => axios.get('/api/me', { headers: apiClient.defaults.headers.common }),
  getProjects: () => apiClient.get('/portfolio/projects'),
  createProject: (title, description) => apiClient.post('/projects', { title, description }),
};

export const paymentService = {
  getConfig: () => axios.get('/api/config'),
  createPaymentIntent: (amount, currency) => apiClient.post('/payment/create-payment-intent', { amount, currency }),
};

export default apiClient;
