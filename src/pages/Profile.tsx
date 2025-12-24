import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield,
  BadgeCheck,
  Hash
} from 'lucide-react';

export default function Profile() {
  // Mock user data - replace with actual data from localStorage or API
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    name: '',
    phone: '',
    role: '',
    subrole: '',
  });

  useEffect(() => {
    // Get user data from localStorage (stored during login)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData({
        id: user.id || 'N/A',
        email: user.email || 'N/A',
        name: user.name || 'N/A',
        phone: user.phone || 'N/A',
        role: user.role || 'N/A',
        subrole: user.subrole || 'N/A',
      });
    }
  }, []);

  const profileFields = [
    { key: 'id', label: 'ID', icon: Hash, value: userData.id },
    { key: 'email', label: 'Email', icon: Mail, value: userData.email },
    { key: 'name', label: 'Name', icon: User, value: userData.name },
    { key: 'phone', label: 'Phone', icon: Phone, value: userData.phone },
    { key: 'role', label: 'Role', icon: Shield, value: userData.role },
    { key: 'subrole', label: 'Subrole', icon: BadgeCheck, value: userData.subrole },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500 mt-1">View your account information</p>
      </div>

      {/* Profile Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div 
          className="h-24 md:h-32 relative"
          style={{ backgroundColor: '#7C57FC' }}
        >
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
              <div 
                className="w-full h-full flex items-center justify-center text-white text-3xl font-bold"
                style={{ backgroundColor: '#7C57FC' }}
              >
                {userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
              </div>
            </div>
          </div>
        </div>

        {/* User Name */}
        <div className="pt-16 pb-4 text-center border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{userData.name || 'User'}</h2>
          <p className="text-gray-500">{userData.role}</p>
        </div>

        {/* Profile Fields */}
        <div className="p-6 md:p-8">
          <div className="space-y-4">
            {profileFields.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.key}
                  className="flex items-center p-4 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                    style={{ backgroundColor: '#7C57FC20' }}
                  >
                    <Icon size={20} style={{ color: '#7C57FC' }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{field.label}</p>
                    <p className="font-medium text-gray-800">{field.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}