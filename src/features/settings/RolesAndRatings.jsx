import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function RolesAndRatings() {
  const [roles, setRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', pay: 0 });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from('roles_and_ratings')
      .select('*')
      .order('name', { ascending: true });

    if (error) console.error('Error fetching roles:', error);
    else setRoles(data);
  };

  const startEditing = (role) => {
    setEditingId(role.id);
    setFormData({ name: role.name, pay: role.pay });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ name: '', pay: 0 });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('roles_and_ratings')
      .update({ name: formData.name, pay: formData.pay })
      .eq('id', editingId);

    if (error) console.error('Update error:', error);
    else {
      cancelEditing();
      fetchRoles();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Roles and Ratings</h2>
      <table className="w-full text-sm border border-gray-300 shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Role/Rating Name</th>
            <th className="p-2 border text-center">Pay ($)</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {editingId === role.id ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  role.name
                )}
              </td>
              <td className="p-2 border text-center">
                {editingId === role.id ? (
                  <input
                    type="number"
                    className="border px-2 py-1 w-20 text-center rounded"
                    value={formData.pay}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pay: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                ) : (
                  `$${role.pay?.toFixed(2)}`
                )}
              </td>
              <td className="p-2 border text-center">
                {editingId === role.id ? (
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
                    onClick={() => startEditing(role)}
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

export default RolesAndRatings;
