import React, { useState, useEffect } from 'react';
import {
  Search,
  User as UserIcon,
  Zap,
  Wrench,
  ShieldCheck,
  Cpu,
  Globe,
  CreditCard,
  Menu,
  X,
  AlertCircle,
  Key,
  Gamepad2,
  Database,
  Code2,
  Scale,
  Stethoscope,
  Plane,
  Music,
  ShoppingBag,
  ShieldAlert,
  Binary,
  FlaskConical,
  Truck,
  Building2,
  BookOpen,
  Microscope,
  Layout,
  Mail
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { userService, aiService, setAuthToken, type User } from './api';
import axios from 'axios';

interface AIService {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  description: string;
}

const AI_SERVICES: AIService[] = [
  { id: 'langflow', name: 'Langflow Executor', category: 'Advanced', icon: Zap, description: 'Execute complex AI workflows using Langflow.' },
  { id: 'website', name: 'Website Developer', category: 'Development', icon: Globe, description: 'Generate multi-section HTML/CSS websites.' },
  { id: 'game', name: 'Game Developer', category: 'Development', icon: Gamepad2, description: 'Create custom games using AI technologies.' },
  { id: 'backend', name: 'Backend Architect', category: 'Infrastructure', icon: Database, description: 'Generate robust Python/Flask backends.' },
  { id: 'blockchain', name: 'Blockchain Expert', category: 'Development', icon: Code2, description: 'Smart contract and blockchain solutions.' },
  { id: 'fintech', name: 'Fintech Strategist', category: 'Business', icon: CreditCard, description: 'Banking and financial technology consulting.' },
  { id: 'legal', name: 'Legal & Human Rights', category: 'Professional', icon: Scale, description: 'Expert legal research and advocacy support.' },
  { id: 'diagnostic', name: 'Medical Diagnostic', category: 'Health', icon: Stethoscope, description: 'Expert diagnostic assistance for all diseases, focusing on cancer and heart disease.' },
  { id: 'aerospace', name: 'Aerospace & Auto', category: 'Engineering', icon: Plane, description: 'Aeronautics and automotive technical guidance.' },
  { id: 'music', name: 'Music Producer', category: 'Arts', icon: Music, description: 'Beat production and artist marketing.' },
  { id: 'eshop', name: 'E-commerce Guru', category: 'Business', icon: ShoppingBag, description: 'Create and manage high-performing e-shops.' },
  { id: 'investigation', name: 'Cyber Investigator', category: 'Security', icon: ShieldAlert, description: 'Digital forensics and security investigation.' },
  { id: 'ml-expert', name: 'Machine Learning', category: 'Development', icon: Binary, description: 'Algorithm selection and model optimization.' },
  { id: 'biotech', name: 'Biotech Specialist', category: 'Science', icon: FlaskConical, description: 'Molecular biology and regulatory research.' },
  { id: 'logistics', name: 'Logistics Manager', category: 'Business', icon: Truck, description: 'Route optimization and movement management.' },
  { id: 'it-ops', name: 'IT Operations', category: 'Infrastructure', icon: Cpu, description: 'Server and network administration.' },
  { id: 'gov-admin', name: 'Gov Administrator', category: 'Public', icon: Building2, description: 'Navigating government services and documents.' },
  { id: 'education', name: 'Science Educator', category: 'Academic', icon: BookOpen, description: 'Mathematics, physics, and biology education.' },
  { id: 'verification', name: 'Content Verifier', category: 'Security', icon: ShieldCheck, description: 'AI content and fake news detection.' },
  { id: 'maintenance', name: 'Hardware Expert', category: 'Support', icon: Wrench, description: 'Software & hardware troubleshooting.' },
  { id: 'digital-repair', name: 'Digital Repair', category: 'Support', icon: Wrench, description: 'Troubleshooting media, apps, and websites.' },
  { id: 'researcher', name: 'AI Researcher', category: 'Science', icon: Microscope, description: 'State-of-the-art AI methodology research.' },
  { id: 'google-sites', name: 'Google Sites Specialist', category: 'Infrastructure', icon: Layout, description: 'Google Sites & DNS configuration expert.' },
  { id: 'marketing', name: 'Marketing & Bot Specialist', category: 'Business', icon: Mail, description: 'Expert e-mail, SMS, and bot marketing & management.' }
];

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('register');
  const [username, setUsername] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedService, setSelectedService] = useState<AIService | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [servicePrompt, setServicePrompt] = useState('');
  const [serviceResponse, setServiceResponse] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('globalApiKey');
    if (savedApiKey) {
      setAuthToken(savedApiKey);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userService.getMe();
      setUser(response.data);
      setCredits(1000);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user data', err);
      setError('Invalid API Key or Session Expired');
      localStorage.removeItem('globalApiKey');
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceExecution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!servicePrompt || !selectedService) return;

    try {
      setLoading(true);
      setError(null);
      let response;
      switch (selectedService.id) {
        case 'website':
          response = await aiService.generateWebsite(servicePrompt);
          break;
        case 'google-sites':
          response = await aiService.getGoogleSitesAssistance(servicePrompt);
          break;
        case 'fintech':
          response = await aiService.getFinancialAdvice(servicePrompt);
          break;
        case 'diagnostic':
          response = await aiService.getDiagnosticAssistance(servicePrompt);
          break;
        case 'marketing':
          response = await aiService.getMarketingAssistance(servicePrompt);
          break;
        case 'digital-repair':
          response = await aiService.getDigitalRepairAssistance(servicePrompt);
          break;
        case 'langflow':
          response = await aiService.executeLangflow(servicePrompt);
          break;
        default:
          // Fallback for demo purposes if specific endpoint isn't mapped in aiService yet
          response = { data: { message: "This service is currently in demo mode. The full integration is coming soon!" } };
      }
      setServiceResponse(response.data.message || response.data.promotion_text || "Service executed successfully.");
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to execute service');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (modalMode === 'register') {
        if (!username) return;
        const response = await userService.register(username);
        const { api_key } = response.data;
        localStorage.setItem('globalApiKey', api_key);
        setAuthToken(api_key);
        alert(`Your API Key is: ${api_key}. Please save it to login later!`);
      } else {
        if (!apiKey) return;
        const response = await userService.login(apiKey);
        const { api_key } = response.data;
        localStorage.setItem('globalApiKey', api_key);
        setAuthToken(api_key);
      }
      await fetchUserData();
      setShowLoginModal(false);
      setUsername('');
      setApiKey('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = AI_SERVICES.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Yendoukoa AI</span>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'marketplace' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  Marketplace
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'dashboard' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  Dashboard
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <CreditCard size={16} className="mr-2" />
                    {credits} Credits
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => {
                    localStorage.removeItem('globalApiKey');
                    setAuthToken(null);
                    setUser(null);
                  }}>
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  {loading ? 'Connecting...' : 'Login / Register'}
                </button>
              )}
              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-auto max-w-7xl mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Service Execution Modal */}
      {showServiceModal && selectedService && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowServiceModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full z-[70]">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <selectedService.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Use {selectedService.name}
                    </h3>
                    <div className="mt-4">
                      {!serviceResponse ? (
                        <form onSubmit={handleServiceExecution}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Prompt / Requirements</label>
                            <textarea
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder={`Describe what you need the ${selectedService.name} to do...`}
                              value={servicePrompt}
                              onChange={(e) => setServicePrompt(e.target.value)}
                              rows={5}
                              required
                            />
                          </div>
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              {loading ? 'Processing...' : 'Run Service (50 Credits)'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowServiceModal(false)}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg border max-h-[400px] overflow-y-auto">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{serviceResponse}</p>
                          </div>
                          <div className="flex justify-end">
                             <button
                               onClick={() => setServiceResponse('')}
                               className="mr-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 text-sm"
                             >
                               Try Again
                             </button>
                             <button
                               onClick={() => setShowServiceModal(false)}
                               className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 text-sm"
                             >
                               Done
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowLoginModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-[70]">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    {modalMode === 'register' ? <UserIcon className="h-6 w-6 text-blue-600" /> : <Key className="h-6 w-6 text-blue-600" />}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {modalMode === 'register' ? 'Join Yendoukoa AI' : 'Login with API Key'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        {modalMode === 'register' ? (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                              type="text"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Choose a username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              required
                            />
                          </div>
                        ) : (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">API Key</label>
                            <input
                              type="password"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter your API Key"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                              required
                            />
                          </div>
                        )}
                        <div className="mt-4 flex justify-center text-sm">
                           <button
                             type="button"
                             onClick={() => setModalMode(modalMode === 'register' ? 'login' : 'register')}
                             className="text-blue-600 hover:underline"
                           >
                             {modalMode === 'register' ? 'Already have an API Key? Login' : 'Need an account? Register'}
                           </button>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            {loading ? 'Processing...' : modalMode === 'register' ? 'Register' : 'Login'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowLoginModal(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LangChain/Langflow Badge */}
      <div className="bg-blue-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center space-x-4 text-xs font-semibold">
           <span className="bg-blue-500 px-2 py-1 rounded">Powered by LangChain</span>
           <span className="bg-green-500 px-2 py-1 rounded">Enhanced with Langflow</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-center">
            AI Service Marketplace
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto text-center">
            Discover and utilize professional AI services for your business, development, and personal projects.
          </p>
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white sm:text-sm"
                placeholder="Search for AI services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'marketplace' ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Services</h2>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {['All', 'Development', 'Business', 'Support', 'Security'].map(cat => (
                  <button key={cat} className="whitespace-nowrap px-4 py-2 rounded-full border bg-white hover:bg-gray-50 text-sm font-medium">
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {filteredServices.map((service) => (
                <div key={service.id} className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <service.icon size={24} />
                      </div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      <a href={`#${service.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {service.name}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-blue-600 font-bold">50 Credits</span>
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setShowServiceModal(true);
                          setServicePrompt('');
                          setServiceResponse('');
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 z-10"
                      >
                        Use Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
             <div className="bg-white p-8 rounded-xl shadow-sm border">
                <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
                {!user ? (
                   <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">Please login to view your dashboard</p>
                      <button onClick={() => setShowLoginModal(true)} className="text-blue-600 font-bold hover:underline">Login or Register Now</button>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                      <p className="text-blue-600 text-sm font-medium uppercase">Total Balance</p>
                      <p className="text-3xl font-bold mt-1 text-blue-900">{credits} Credits</p>
                    <p className="text-xs text-blue-400 mt-2 italic">* Balance is currently estimated</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                      <p className="text-green-600 text-sm font-medium uppercase">Active Projects</p>
                      <p className="text-3xl font-bold mt-1 text-green-900">3</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                      <p className="text-purple-600 text-sm font-medium uppercase">Completed Tasks</p>
                      <p className="text-3xl font-bold mt-1 text-purple-900">12</p>
                    </div>
                  </div>
                )}
             </div>

             {user && (
               <>
                 <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b">
                      <h3 className="text-lg font-bold">Integrated Tools</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {AI_SERVICES.slice(0, 3).map((tool) => (
                           <div key={tool.id} className="flex items-center p-4 border rounded-lg bg-gray-50">
                              <tool.icon className="h-8 w-8 text-blue-600 mr-3" />
                              <div>
                                <p className="font-bold text-sm">{tool.name}</p>
                                <p className="text-xs text-green-600 font-medium">Integrated</p>
                              </div>
                           </div>
                        ))}
                        <button className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-colors">
                           <span className="text-sm font-bold">+ Add New Tool</span>
                        </button>
                      </div>
                    </div>
                 </div>

                 <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b">
                      <h3 className="text-lg font-bold">Recent Activity</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {[
                        { id: 1, type: 'Website Gen', date: '2 hours ago', status: 'Completed', cost: '-50' },
                        { id: 2, type: 'Credit Top-up', date: 'Yesterday', status: 'Success', cost: '+1000' },
                        { id: 3, type: 'Legal Review', date: '2 days ago', status: 'Completed', cost: '-50' },
                      ].map((item) => (
                        <li key={item.id} className="px-6 py-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{item.type}</p>
                            <p className="text-xs text-gray-500">{item.date}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${item.cost.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {item.cost}
                            </p>
                            <p className="text-xs text-gray-500">{item.status}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                 </div>
               </>
             )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <span className="text-2xl font-bold text-blue-600">Yendoukoa AI</span>
              <p className="mt-4 text-gray-500 max-w-xs">
                Empowering businesses with professional-grade AI services and custom solutions.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Marketplace</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Development</a></li>
                <li><a href="#" className="hover:text-blue-600">Design</a></li>
                <li><a href="#" className="hover:text-blue-600">Business</a></li>
                <li><a href="#" className="hover:text-blue-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-600">Community</a></li>
                <li><a href="https://github.com/GYFX35/AI-services" className="hover:text-blue-600">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-gray-400">
            &copy; 2026 Yendoukoa AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
