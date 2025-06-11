import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else if (data?.user) {
      navigate('/');
    }
  };

  return (
    <div className="p-8 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-title">Sign In</h1>

      <input
        type="email"
        placeholder="Email"
        className="input w-full border border-border bg-bg text-fg px-3 py-2"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
      />

      <input
        type="password"
        placeholder="Password"
        className="input w-full border border-border bg-bg text-fg px-3 py-2"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError('');
        }}
      />

      <button
        onClick={handleSignIn}
        className="btn bg-accent text-button-text px-4 py-2 w-full"
      >
        Sign In
      </button>

      {error && <p className="text-error mt-2">❌ {error}</p>}
    </div>
  );
}

export default SignIn;
