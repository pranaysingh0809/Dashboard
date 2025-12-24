import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    // Validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email }); // Don't log password
      
      const response = await fetch('https://api.sk.andaihub.ai/api/auth/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      // Check if login was successful based on API response
      if (response.ok && data.success) {
        // Store the authentication token from nested data object
        const token = data.data?.token;
        if (token) {
          localStorage.setItem('authToken', token);
        }
        
        // Store user data from nested data object
        const user = data.data?.user;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        toast({
          title: "Success",
          description: data.message || "Login successful! Redirecting...",
        });

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 200);
      } else {
        // Handle error response
        toast({
          title: "Login Failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-50 rounded-full opacity-30 blur-2xl"></div>

      {/* Login card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="max-w-[200px] h-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Instruction text */}
        <p className="text-center text-gray-700 mb-8">
          Please enter valid e-mail ID and password to login
        </p>

        {/* Login inputs */}
        <div className="space-y-6">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="abc@xyz.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 transition-colors pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot password link */}
          <div className="text-right">
            <a 
              href="#" 
              className="text-sm font-medium transition-colors"
              style={{ color: '#7C57FC' }}
            >
              Forgot Password?
            </a>
          </div>

          {/* Login button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            style={{ backgroundColor: '#7C57FC' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </div>

        {/* Optional: Sign up link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <a 
            href="#" 
            className="font-semibold transition-colors"
            style={{ color: '#7C57FC' }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}