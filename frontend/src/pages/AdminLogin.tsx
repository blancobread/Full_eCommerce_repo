import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { FormData } from '../types/types';
import { getAxiosErrorMessage } from '../utils/axiosError';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function AdminLogin() {
  const { register, handleSubmit, formState } = useForm<FormData>();
  const setToken = useAuthStore((state) => state.setToken);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(
        'http://localhost:5001/admin/login',
        data,
      );
      setToken(response.data.token);
      setError(null);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(getAxiosErrorMessage(err));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-700 via-pink-500 to-yellow-400 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl rounded-2xl animate-fade-in">
        <div className="card-body space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="text-primary w-8 h-8 animate-bounce" />
            <h1 className="text-3xl font-bold text-primary">Party Admin</h1>
          </div>

          <p className="text-center text-gray-500">
            Manage your garlands and orders
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="input input-bordered w-full"
              autoComplete="username"
              {...register('username', { required: true })}
            />

            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              autoComplete="current-password"
              {...register('password', { required: true })}
            />

            {error && <p className="text-red-500">{error}</p>}

            <button
              className="btn btn-primary w-full hover:scale-105 transition transform duration-200"
              type="submit"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
