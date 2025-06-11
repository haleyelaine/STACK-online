import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function StudentJumps() {
  const [jumps, setJumps] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slots_required: 1,
    price: 0,
    category: '',
  });

  useEffect(() => {
    fetchJumps();
  }, []);

  const fetchJumps = async () => {
    const { data, error } = await supabase
      .from('student_jumps')
      .select('*')
      .order('slots_required', { ascending: true });

    if (error) console.error('Error fetching student jumps:', error);
    else setJumps(data);
  };

  const startEditing = (jump) => {
    setEditingId(jump.id);
    setFormData({
      name: jump.name,
      slots_required: jump.slots_required,
      price: jump.price,
      category: jump.category,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slots_required: 1,
      price: 0,
      category: '',
    });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('student_jumps')
      .update({
        name: formData.name,
        slots_required: formData.slots_required,
        price: formData.price,
        category: formData.category,
      })
      .eq('id', editingId);

    if (error) console.error('Update error:', error);
    else {
      cancelEditing();
      fetchJumps();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Student Jumps</h2>
      <table className="w-full text-sm border border-gray-300 shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border text-center">Slots</th>
            <th className="p-2 border text-center">Price ($)</th>
            <th className="p-2 border text-center">Category</th>
            <th className="p-2 border text-center">Roles Required</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jumps.map((jump) => (
            <tr key={jump.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {editingId === jump.id ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  jump.name
                )}
              </td>
              <td className="p-2 border text-center">
                {editingId === jump.id ? (
                  <input
                    type="number"
                    className="border px-2 py-1 w-16 text-center rounded"
                    value={formData.slots_required}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        slots_required: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                ) : (
                  jump.slots_required
                )}
              </td>
              <td className="p-2 border text-center">
                {editingId === jump.id ? (
                  <input
                    type="number"
                    className="border px-2 py-1 w-20 text-center rounded"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                ) : (
                  `$${jump.price}`
                )}
              </td>
              <td className="p-2 border text-center">
                {editingId === jump.id ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                  />
                ) : (
                  jump.category
                )}
              </td>
              <td className="p-2 border text-center text-xs text-gray-700">
                {jump.roles_required?.join(', ')}
              </td>
              <td className="p-2 border text-center">
                {editingId === jump.id ? (
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
                    className="bg-button text-white px-3 py-1 rounded"
                    onClick={() => startEditing(jump)}
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

export default StudentJumps;
