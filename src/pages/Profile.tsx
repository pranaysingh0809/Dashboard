import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Shield,
  BadgeCheck,
  Hash,
  Loader2,
  AlertCircle,
  RefreshCw,
  Home
} from 'lucide-react';

export default function Profile() {
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    name: '',
    phone: '',
    role: '',
    subrole: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setError('No authentication token found. Please login again.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('https://api.sk.andaihub.ai/api/auth/profile', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const user = data.data?.user || data.user || data;
        setUserData({
          id: user.id || user._id || 'N/A',
          email: user.email || 'N/A',
          name: user.name || 'N/A',
          phone: user.phone || user.Phone || 'N/A',
          role: user.role || 'N/A',
          subrole: user.subRole || user.subrole || 'N/A',
        });
      } else {
        setError(data.message || 'Failed to fetch profile data');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('An error occurred while fetching profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const profileFields = [
    { key: 'id', label: 'ID', icon: Hash, value: userData.id },
    { key: 'email', label: 'Email', icon: Mail, value: userData.email },
    { key: 'name', label: 'Name', icon: User, value: userData.name },
    { key: 'phone', label: 'Phone', icon: Phone, value: userData.phone },
    { key: 'role', label: 'Role', icon: Shield, value: userData.role },
    { key: 'subrole', label: 'Subrole', icon: BadgeCheck, value: userData.subrole },
  ];

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 
            className="w-12 h-12 animate-spin mx-auto mb-4" 
            style={{ color: '#7C57FC' }} 
          />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Home size={18} />
              Dashboard
            </button>
            <button
              onClick={fetchProfile}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg"
              style={{ backgroundColor: '#7C57FC' }}
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-500 mt-1">View your account information</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:shadow-lg"
            style={{ backgroundColor: '#7C57FC' }}
          >
            <Home size={18} />
            Dashboard
          </button>
        </div>

        {/* Main Profile Card - Horizontal Layout */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Avatar Section */}
            <div 
              className="lg:w-80 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden"
              style={{ backgroundColor: '#7C57FC' }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>
              
              {/* Avatar */}
              <div className="relative z-10">
                <div className="w-32 h-32 rounded-full border-4 border-white/30 bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-2xl">
                  <span className="text-5xl font-bold text-white">
                    {userData.name && userData.name !== 'N/A' 
                      ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
                      : 'U'}
                  </span>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-1">{userData.name || 'User'}</h2>
                  <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
                    {userData.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Profile Details */}
            <div className="flex-1 p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Account Details</h3>
              
              {/* Profile Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileFields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div
                      key={field.key}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 transition-all duration-300"
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: '#7C57FC15' }}
                      >
                        <Icon size={22} style={{ color: '#7C57FC' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                          {field.label}
                        </p>
                        <p className="font-semibold text-gray-800 truncate">
                          {field.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm font-medium">Active Account</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50" style={{ color: '#7C57FC' }}>
                    <Shield size={16} />
                    <span className="text-sm font-medium">{userData.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}