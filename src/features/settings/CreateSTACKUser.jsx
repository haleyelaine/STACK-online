import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function CreateSTACKUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // must match lowercase enum in DB
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateUser = async () => {
    setError(null);
    setUserId(null);

    // Step 1: Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    const authUserId = authData.user?.id;
    if (!authUserId) {
      setError('No auth user ID returned.');
      return;
    }

    // Step 2: Insert into users table using that ID
    const { data, error } = await supabase
      .from('users')
      .insert([{ id: authUserId, name, email, role }])
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      setUserId(data.id);
    }
  };

  return (
    <div className="p-8 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-title">Create STACK User</h1>

      <input
        className="input input-bordered w-full border border-border bg-bg text-fg px-3 py-2"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="input input-bordered w-full border border-border bg-bg text-fg px-3 py-2"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input input-bordered w-full border border-border bg-bg text-fg px-3 py-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="select select-bordered w-full border border-border bg-bg text-fg px-3 py-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
        <option value="viewer">Viewer</option>
      </select>

      <button
        className="btn bg-accent text-button-text px-4 py-2"
        onClick={handleCreateUser}
      >
        Create User
      </button>

      {userId && <p className="text-success mt-2">✅ Created user with ID: {userId}</p>}
      {error && <p className="text-error mt-2">❌ {error}</p>}
    </div>
  );
}

export default CreateSTACKUser;
