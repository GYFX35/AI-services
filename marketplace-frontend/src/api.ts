import axios from 'axios';

const API_BASE_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['X-API-Key'] = token;
  } else {
    delete apiClient.defaults.headers.common['X-API-Key'];
  }
};

export interface User {
  id: number;
  username: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

export const aiService = {
  generateWebsite: (prompt: string) => apiClient.post('/develop/website', { prompt }),
  debugCode: (prompt: string) => apiClient.post('/debug', { prompt }),
  generateSocialPost: (prompt: string) => apiClient.post('/market/post', { prompt }),
  getWeather: (location: string) => apiClient.post('/weather', { location }),
  getFinancialAdvice: (prompt: string) => apiClient.post('/finance/advice', { prompt }),
  getGoogleSitesAssistance: (prompt: string) => apiClient.post('/google-sites/assistance', { prompt }),
  getDiagnosticAssistance: (prompt: string) => apiClient.post('/diagnostic/assistance', { prompt }),
  getMarketingAssistance: (prompt: string) => apiClient.post('/marketing/assistance', { prompt }),
  getDigitalRepairAssistance: (prompt: string) => apiClient.post('/digital-repair/assistance', { prompt }),
  executeLangflow: (prompt: string) => apiClient.post('/langflow/execute', { prompt }),
};

export const userService = {
  register: (username: string) => apiClient.post('/register_public', { username }),
  login: (api_key: string) => apiClient.post('/login', { api_key }),
  getMe: () => apiClient.get<User>('/me_api'),
  getProjects: () => apiClient.get<Project[]>('/portfolio/projects'),
  createProject: (title: string, description: string) => apiClient.post<Project>('/projects', { title, description }),
};

export const paymentService = {
  getConfig: () => apiClient.get('/config'),
  createPaymentIntent: (amount: number, currency: string) => apiClient.post('/payment/create-payment-intent', { amount, currency }),
};

export default apiClient;
