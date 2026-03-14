import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  Briefcase,
  Wrench,
  ShieldCheck,
  Cpu,
  Globe,
  TrendingUp,
  CreditCard,
  Menu,
  X,
  AlertCircle
} from 'lucide-react';
import { userService, setAuthToken } from './api';

const AI_SERVICES = [
  { id: 'website', name: 'Website Developer', category: 'Development', icon: Globe, description: 'Generate multi-section HTML/CSS websites.' },
  { id: 'maintenance', name: 'Maintenance Expert', category: 'Support', icon: Wrench, description: 'Software & hardware troubleshooting.' },
  { id: 'it-ops', name: 'IT Ops Specialist', category: 'Infrastructure', icon: Cpu, description: 'Server and network administration.' },
  { id: 'verification', name: 'Content Verifier', category: 'Security', icon: ShieldCheck, description: 'AI content and fake news detection.' },
  { id: 'legal', name: 'Legal Assistant', category: 'Professional', icon: Briefcase, description: 'Legal research and human rights support.' },
  { id: 'marketing', name: 'Marketer', category: 'Business', icon: TrendingUp, description: 'Social media and promotion generator.' }
];

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // In a real app, credits would come from the user object or a separate endpoint
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

  const handleLogin = async () => {
    const username = prompt('Enter your username:');
    if (!username) return;

    try {
      setLoading(true);
      const response = await userService.register(username);
      const { api_key } = response.data;
      localStorage.setItem('globalApiKey', api_key);
      setAuthToken(api_key);
      await fetchUserData();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
              <span className="text-2xl font-bold text-blue-600">UsingAI</span>
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
                  <button className="text-gray-500 hover:text-gray-700">
                    <UserIcon size={24} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
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
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 z-10">
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
                      <button onClick={handleLogin} className="text-blue-600 font-bold hover:underline">Login or Register Now</button>
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
             )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <span className="text-2xl font-bold text-blue-600">UsingAI</span>
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
            &copy; 2026 UsingAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
