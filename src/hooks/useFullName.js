import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

function useFullName() {
  const { user } = useAuth();
  const [name, setName] = useState('');

  useEffect(() => {
    async function fetchName() {
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();

      if (data?.name) setName(data.name);
    }

    fetchName();
  }, [user]);

  return name;
}

export { useFullName };
