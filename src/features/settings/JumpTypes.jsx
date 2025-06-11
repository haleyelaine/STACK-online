import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function JumpTypes() {
  const [jumpTypes, setJumpTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', slots: 1 });

  useEffect(() => {
    fetchJumpTypes();
  }, []);

  const fetchJumpTypes = async () => {
    const { data, error } = await supabase.from('jump_types').select('*');
    if (error) console.error('Error fetching jump types:', error);
    else setJumpTypes(data);
  };

  const startEditing = (jt) => {
    setEditingId(jt.id);
    setFormData({ name: jt.name, slots: jt.slots_required });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ name: '', slots: 1 });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('jump_types')
      .update({ name: formData.name, slots_required: formData.slots })
      .eq('id', editingId);

    if (error) console.error('Update error:', error);
    else {
      cancelEditing();
      fetchJumpTypes();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-bg text-fg">
      <h2 className="text-2xl font-bold mb-6">Jump Types Settings</h2>
      <table className="w-full text-sm border border-fg/20 shadow-sm">
        <thead className="bg-fg/10">
          <tr>
            <th className="p-2 border border-fg/20">Name</th>
            <th className="p-2 border border-fg/20">Slots</th>
            <th className="p-2 border border-fg/20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jumpTypes.map((jt) => (
            <tr key={jt.id} className="hover:bg-fg/5">
              <td className="p-2 border border-fg/20">
                {editingId === jt.id ? (
                  <input
                    className="border border-fg/20 px-2 py-1 rounded w-full bg-bg text-fg"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  jt.name
                )}
              </td>
              <td className="p-2 border border-fg/20 text-center">
                {editingId === jt.id ? (
                  <input
                    type="number"
                    className="border border-fg/20 px-2 py-1 w-16 text-center rounded bg-bg text-fg"
                    value={formData.slots}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        slots: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                ) : (
                  jt.slots_required
                )}
              </td>
              <td className="p-2 border border-fg/20 text-center">
                {editingId === jt.id ? (
                  <div className="flex gap-2 justify-center">
                    <button
                      className="bg-gray-300 text-gray-900 px-3 py-1 rounded"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-hover text-accent px-3 py-1 rounded"
                      onClick={handleUpdate}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-accent text-white px-3 py-1 rounded"
                    onClick={() => startEditing(jt)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JumpTypes;