import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      await register(email, password, name);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              onToggleMode={toggleMode}
              loading={loading}
              error={error}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              onToggleMode={toggleMode}
              loading={loading}
              error={error}
            />
          )}
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Features you'll love:
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-600 dark:text-gray-400">
            <span>🤖 AI Summaries</span>
            <span>📚 Spaced Repetition</span>
            <span>🌙 Dark Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};