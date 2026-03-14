import React, { useState, useEffect } from 'react';
import {
  Search, ShoppingCart, User as UserIcon, Briefcase, Wrench, ShieldCheck, Cpu, Globe, TrendingUp, CreditCard,
  Menu, X, AlertCircle, Rocket, Code, Bug, BarChart, Landmark, Palette, Settings, GraduationCap, Music,
  Zap, Map, FileText, Database, Shield, Podcast, Truck, Scale, Heart, Biohazard, Plane, Layout, Layers,
  Eye, Microscope, Trophy, Stethoscope, ShoppingBag, Terminal
} from 'lucide-react';
import { userService, trackService, aiService, setAuthToken } from './api';

const AI_SERVICES = [
  { id: 'website', name: 'Website Developer', category: 'Development', icon: Globe, description: 'Generate multi-section HTML/CSS websites.', endpoint: 'generateWebsite' },
  { id: 'game', name: 'Game Developer', category: 'Development', icon: Rocket, description: 'Create custom games with HTML, CSS, and JS.', endpoint: 'generateGame' },
  { id: 'app', name: 'App Developer', category: 'Development', icon: Layout, description: 'Build interactive web applications.', endpoint: 'generateApp' },
  { id: 'backend', name: 'Backend Generator', category: 'Development', icon: Terminal, description: 'Generate Python/Flask backend code.', endpoint: 'generateBackend' },
  { id: 'blockchain', name: 'Blockchain Expert', category: 'Development', icon: Database, description: 'Generate blockchain and smart contract code.', endpoint: 'generateBlockchain' },
  { id: 'debug', name: 'Code Debugger', category: 'Support', icon: Bug, description: 'Analyze and fix your HTML, CSS, and JS code.', endpoint: 'debugCode' },
  { id: 'it-support', name: 'IT Support', category: 'Support', icon: Wrench, description: 'Step-by-step solutions for technical issues.', endpoint: 'itSupport' },
  { id: 'it-ops', name: 'IT Operations', category: 'Infrastructure', icon: Cpu, description: 'Server management and infrastructure as code.', endpoint: 'itOperations' },
  { id: 'maintenance', name: 'Maintenance Expert', category: 'Support', icon: Settings, description: 'Software and hardware troubleshooting.', endpoint: 'maintenance' },
  { id: 'marketing', name: 'Social Media Marketer', category: 'Business', icon: TrendingUp, description: 'Generate catchy social media posts.', endpoint: 'generateSocialPost' },
  { id: 'ads', name: 'Ads Optimizer', category: 'Business', icon: BarChart, description: 'Optimize ad campaigns and keywords.', endpoint: 'optimizeAds' },
  { id: 'business-strategy', name: 'Business Strategist', category: 'Business', icon: Briefcase, description: 'Develop comprehensive business strategies.', endpoint: 'businessStrategy' },
  { id: 'business-plan', name: 'Business Plan Creator', category: 'Business', icon: FileText, description: 'Draft and perfect your business plan.', endpoint: 'businessPlan' },
  { id: 'ecommerce', name: 'E-commerce Manager', category: 'Business', icon: ShoppingBag, description: 'Manage platforms and product listings.', endpoint: 'ecommerce' },
  { id: 'eshop', name: 'E-shop Specialist', category: 'Business', icon: ShoppingCart, description: 'Strategic e-commerce site guidance.', endpoint: 'eshop' },
  { id: 'finance', name: 'Financial Advisor', category: 'Business', icon: Landmark, description: 'Financial advice and management help.', endpoint: 'financeAdvice' },
  { id: 'fintech', name: 'Fintech Strategist', category: 'Business', icon: Zap, description: 'Banking and VC data scale & security.', endpoint: 'fintech' },
  { id: 'legal', name: 'Legal Assistant', category: 'Professional', icon: Scale, description: 'Legal research and human rights support.', endpoint: 'legal' },
  { id: 'government', name: 'Government Admin', category: 'Professional', icon: Shield, description: 'Navigate public administration and services.', endpoint: 'government' },
  { id: 'science', name: 'Science Educator', category: 'Education', icon: GraduationCap, description: 'Math, physics, biology, and more.', endpoint: 'sciencesEducator' },
  { id: 'music', name: 'Music Instrumentalist', category: 'Arts', icon: Music, description: 'Musical suggestions and compositions.', endpoint: 'playMusic' },
  { id: 'music-production', name: 'Music Producer', category: 'Arts', icon: Layers, description: 'Beats, song structures, and promotion.', endpoint: 'musicProduction' },
  { id: 'art', name: 'Art Critic', category: 'Arts', icon: Palette, description: 'Art critiques and creative ideas.', endpoint: 'artCriticism' },
  { id: 'investigation', name: 'Investigator', category: 'Security', icon: ShieldCheck, description: 'Cybersecurity and data protection experts.', endpoint: 'investigation' },
  { id: 'verification', name: 'Content Verifier', category: 'Security', icon: Eye, description: 'AI content and fake news detection.', endpoint: 'fakeContent' },
  { id: 'military', name: 'Military Strategist', category: 'Security', icon: Shield, description: 'Tactical planning and security strategy.', endpoint: 'military' },
  { id: 'diagnostic', name: 'Diagnostic Specialist', category: 'Healthcare', icon: Stethoscope, description: 'Symptom analysis and healthcare info.', endpoint: 'diagnostic' },
  { id: 'dermatology', name: 'Dermatologist', category: 'Healthcare', icon: Heart, description: 'Skin condition and skincare guidance.', endpoint: 'dermatology' },
  { id: 'biotech', name: 'Biotech Specialist', category: 'Science', icon: Biohazard, description: 'Molecular biology and bioprocess engineering.', endpoint: 'biotech' },
  { id: 'aerospace', name: 'Aerospace Specialist', category: 'Science', icon: Plane, description: 'Automotive, aeronautics, and astronomy.', endpoint: 'aerospaceAutomotive' },
  { id: 'data-eng', name: 'Data Engineer', category: 'Data', icon: Database, description: 'Robust data pipelines and architectures.', endpoint: 'dataEngineering' },
  { id: 'ia-data-eng', name: 'IA Data Engineer', category: 'Data', icon: Cpu, description: 'AI-driven automated data pipelines.', endpoint: 'iaDataEngineering' },
  { id: 'computer-vision', name: 'Vision Specialist', category: 'Data', icon: Eye, description: 'Image and video analysis experts.', endpoint: 'computerVision' },
  { id: 'ia-researcher', name: 'IA Researcher', category: 'Data', icon: Microscope, description: 'SOTA research and methodology insights.', endpoint: 'iaResearcher' },
  { id: 'esports', name: 'eSports Assistant', category: 'Sports', icon: Trophy, description: 'Team management and tournament planning.', endpoint: 'esports' }
];

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [selectedService, setSelectedService] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [serviceResponse, setServiceResponse] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('globalApiKey');
    if (savedApiKey) {
      setAuthToken(savedApiKey);
      fetchUserData();
    }
    trackService.trackView();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await trackService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userService.getMe();
      setUser(response.data);
      setCredits(1000); // Mock credits for demo
    } catch (err) {
      console.error('Failed to fetch user data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const username = prompt("Enter username:");
    if (!username) return;
    try {
      setLoading(true);
      const response = await userService.register(username);
      const { api_key } = response.data;
      localStorage.setItem('globalApiKey', api_key);
      setAuthToken(api_key);
      await fetchUserData();
    } catch (err) {
      setError("Login failed. Username might already exist.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseService = async () => {
    if (!user) {
      alert("Please login first.");
      return;
    }
    if (!userInput) {
      alert("Please enter a request.");
      return;
    }
    try {
      setLoading(true);
      setServiceResponse("Processing...");
      const response = await aiService[selectedService.endpoint](userInput);
      setServiceResponse(response.data.message || response.data.promotion_text || response.data.ad_copy?.ad_copy || response.data.criticism || JSON.stringify(response.data, null, 2));
      await trackService.trackUsage(selectedService.id);
      fetchStats();
    } catch (err) {
      setServiceResponse("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = AI_SERVICES.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-600">UsingAI</span>
              <div className="hidden md:flex space-x-8 ml-10">
                <button onClick={() => setActiveTab('marketplace')} className={`text-sm font-medium ${activeTab === 'marketplace' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Marketplace</button>
                <button onClick={() => setActiveTab('dashboard')} className={`text-sm font-medium ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Dashboard</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold">{user.username}</p>
                    <p className="text-xs text-blue-600 font-semibold">{credits} Credits</p>
                  </div>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <UserIcon size={24} />
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
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
            <div className="flex-shrink-0"><AlertCircle className="h-5 w-5 text-red-400" /></div>
            <div className="ml-3"><p className="text-sm text-red-700">{error}</p></div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">AI Service Marketplace</h1>
          <p className="mt-4 text-lg text-blue-100">Professional AI solutions for every industry.</p>
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><Search className="h-5 w-5 text-gray-400" /></div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {selectedService ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setSelectedService(null)} className="text-blue-600 flex items-center mb-6 hover:underline">
              <X size={16} className="mr-1" /> Back to Marketplace
            </button>
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-xl text-blue-600"><selectedService.icon size={32} /></div>
              <div>
                <h2 className="text-2xl font-bold">{selectedService.name}</h2>
                <p className="text-gray-500">{selectedService.description}</p>
              </div>
            </div>
            <textarea
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-40 bg-gray-50"
              placeholder={`Enter your request for ${selectedService.name}...`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              onClick={handleUseService}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Run AI Service (50 Credits)'}
            </button>
            {serviceResponse && (
              <div className="mt-8 p-6 bg-gray-900 text-gray-100 rounded-xl overflow-x-auto">
                <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Response</h3>
                <pre className="whitespace-pre-wrap font-mono text-sm">{serviceResponse}</pre>
              </div>
            )}
          </div>
        ) : activeTab === 'marketplace' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-xl border hover:shadow-md transition-all group cursor-pointer" onClick={() => setSelectedService(service)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <service.icon size={24} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">{service.category}</span>
                </div>
                <h3 className="text-lg font-bold">{service.name}</h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{service.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-sm">50 Credits</span>
                  <span className="text-blue-600 text-sm font-bold flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    Try Now <Zap size={14} className="ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center py-20">
            <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
            <p className="text-gray-500">History and project management coming soon.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 UsingAI. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-8">
             <div className="flex flex-col">
                <span className="font-bold text-gray-900">{stats.page_views || 0}</span>
                <span>Page Views</span>
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-gray-900">
                   {Object.entries(stats).reduce((acc, [k, v]) => k.startsWith('usage_') ? acc + v : acc, 0)}
                </span>
                <span>Services Used</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
