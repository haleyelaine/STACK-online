import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const JumpersContext = createContext();

export const JumpersProvider = ({ children }) => {
  const [jumpers, setJumpers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJumpers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jumpers')
      .select('*'); // No join needed — group_name is a flat text field now

    if (!error) {
      setJumpers(data || []);
    } else {
      console.error('Failed to load jumpers:', error);
    }

    setLoading(false);
  }, []);

  const updateJumper = useCallback(async (id, updates) => {
  const { data, error } = await supabase
    .from('jumpers')
    .update(updates)
    .eq('id', id)
    .select();

  if (!error && data) {
    await loadJumpers(); // this will now reflect actual updated state
  } else {
    console.error('Failed to update jumper:', error);
  }
}, [loadJumpers]);

  const removeJumper = useCallback(async (id) => {
    const { error } = await supabase
      .from('jumpers')
      .delete()
      .eq('id', id);

    if (!error) {
      await loadJumpers();
    }
  }, [loadJumpers]);

  useEffect(() => {
    loadJumpers();
  }, [loadJumpers]);

  return (
    <JumpersContext.Provider value={{ jumpers, updateJumper, removeJumper, reload: loadJumpers, loading }}>
      {children}
    </JumpersContext.Provider>
  );
};

export const useJumpers = () => useContext(JumpersContext);
