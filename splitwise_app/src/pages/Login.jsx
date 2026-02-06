import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { CURRENT_USER_ID, USERS } from '../utils/mockData';
import { Logo } from '../components/ui/Logo';

export default function Login() {
  // No hardcoded initial state - let user type or default to one of the mocks
  const [email, setEmail] = useState('devparikh200479@gmail.com');
  const [name, setName] = useState('Dev Parikh');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Find user by email in our mock database
    const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Simulate network delay for "premium feel"
    setTimeout(() => {
      if (user) {
        dispatch(login(user.id));
        navigate('/app');
      } else {
        // If not found in mocks, for hackathon demo we can just use User 1 or show error
        // Showing error is better for "detecting person"
        setError("User not found! Try 'dev@demo.com' or 'jay@demo.com'");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center mb-8">
          <Logo className="scale-125 mb-4" />
          <h1 className="text-2xl font-bold tracking-tight mt-4">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Don't have an account? <Link to="#" className="text-brand-600 font-medium hover:underline">Sign up</Link></p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link to="/" className="text-slate-400 hover:text-slate-600">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
