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
  // Development
  generateWebsite: (prompt) => apiClient.post('/develop/website', { prompt }),
  generateGame: (prompt) => apiClient.post('/develop/game', { prompt }),
  generateApp: (prompt) => apiClient.post('/develop/app', { prompt }),
  generateBackend: (prompt) => apiClient.post('/develop/backend', { prompt }),
  generateBlockchain: (prompt) => apiClient.post('/develop/blockchain', { prompt }),
  generateBlogger: (prompt) => apiClient.post('/develop/blogger', { prompt }),
  generateMessenger: (prompt) => apiClient.post('/develop/messenger', { prompt }),

  // Support & IT
  debugCode: (prompt) => apiClient.post('/debug', { prompt }),
  itSupport: (prompt) => apiClient.post('/support/it', { prompt }),
  itOperations: (prompt) => apiClient.post('/it-operations/assistance', { prompt }),
  maintenance: (prompt) => apiClient.post('/maintenance/assistance', { prompt }),
  telecomSupport: (prompt) => apiClient.post('/support/telecommunication', { prompt }),
  telecomAssistant: (prompt) => apiClient.post('/assistant/telecommunication', { prompt }),

  // Business & Marketing
  generateSocialPost: (prompt) => apiClient.post('/market/post', { prompt }),
  optimizeAds: (prompt) => apiClient.post('/optimize/ads', { prompt }),
  businessStrategy: (prompt) => apiClient.post('/business/strategy', { prompt }),
  businessPlan: (prompt) => apiClient.post('/business/plan', { prompt }),
  ecommerce: (prompt) => apiClient.post('/ecommerce/assistance', { prompt }),
  eshop: (prompt) => apiClient.post('/eshop/assistance', { prompt }),
  supplyChain: (prompt) => apiClient.post('/supply-chain/assistance', { prompt }),
  logistics: (prompt) => apiClient.post('/logistics/assistance', { prompt }),
  incoterms: (prompt) => apiClient.post('/incoterms/assistance', { prompt }),
  fintech: (prompt) => apiClient.post('/fintech/assistance', { prompt }),

  // Data & AI
  analyzeWebsite: (url) => apiClient.post('/analyze/website', { url }),
  analyzeData: (prompt) => apiClient.post('/data/analyze', { prompt }),
  dataEngineering: (prompt) => apiClient.post('/data-engineering/assistance', { prompt }),
  iaDataEngineering: (prompt) => apiClient.post('/ia-data-engineering/assistance', { prompt }),
  dataLabCenter: (prompt) => apiClient.post('/data-lab-center/assistance', { prompt }),
  dataScienceStewardship: (prompt) => apiClient.post('/data-science-stewardship/assistance', { prompt }),
  automaticLearning: (prompt) => apiClient.post('/automatic-learning/assistance', { prompt }),
  computerVision: (prompt) => apiClient.post('/computer-vision/assistance', { prompt }),
  iaResearcher: (prompt) => apiClient.post('/ia-researcher/assistance', { prompt }),
  microsoftIgnite: (prompt) => apiClient.post('/microsoft-ignite/assistance', { prompt }),

  // Specialized Roles
  weather: (location) => apiClient.post('/weather', { location }),
  financeAdvice: (prompt) => apiClient.post('/finance/advice', { prompt }),
  artCriticism: (prompt) => apiClient.post('/art/criticism', { prompt }),
  automateScript: (prompt) => apiClient.post('/automate/script', { prompt }),
  learnLanguage: (prompt) => apiClient.post('/learn/language', { prompt }),
  sciencesEducator: (prompt) => apiClient.post('/sciences/educator', { prompt }),
  transactionAssistance: (prompt) => apiClient.post('/assistance/transaction', { prompt }),
  playMusic: (prompt) => apiClient.post('/play/music', { prompt }),
  musicProduction: (prompt) => apiClient.post('/music/production', { prompt }),
  geometry: (prompt) => apiClient.post('/assistance/geometry', { prompt }),
  cartography: (prompt) => apiClient.post('/assistance/cartography', { prompt }),
  document: (prompt) => apiClient.post('/assistance/document', { prompt }),
  investigation: (prompt) => apiClient.post('/investigation/security', { prompt }),
  military: (prompt) => apiClient.post('/military/assistance', { prompt }),
  podcast: (prompt) => apiClient.post('/podcast/assistance', { prompt }),
  government: (prompt) => apiClient.post('/government/assistance', { prompt }),
  biotech: (prompt) => apiClient.post('/biotech/assistance', { prompt }),
  legal: (prompt) => apiClient.post('/legal/assistance', { prompt }),
  aerospaceAutomotive: (prompt) => apiClient.post('/aerospace-automotive/assistance', { prompt }),
  logoThumbnail: (prompt) => apiClient.post('/logo-thumbnail/assistance', { prompt }),
  fakeContent: (prompt) => apiClient.post('/fake-content/verification', { prompt }),
  esports: (prompt) => apiClient.post('/esports/assistance', { prompt }),
  dermatology: (prompt) => apiClient.post('/dermatology/assistance', { prompt }),
  diagnostic: (prompt) => apiClient.post('/diagnostic/assistance', { prompt }),
  translate: (text, target_language) => apiClient.post('/translate', { text, target_language }),
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

export const trackService = {
  trackView: () => apiClient.post('/track/view'),
  trackUsage: (tool) => apiClient.post('/track/usage', { tool }),
  getStats: () => apiClient.get('/stats'),
};

export default apiClient;
