import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function MediaOptions() {
  const [mediaOptions, setMediaOptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: 0 });

  useEffect(() => {
    fetchMediaOptions();
  }, []);

  const fetchMediaOptions = async () => {
    const { data, error } = await supabase
      .from('media_options')
      .select('*')
      .order('price', { ascending: true });

    if (error) console.error('Error fetching media options:', error);
    else setMediaOptions(data);
  };

  const startEditing = (option) => {
    setEditingId(option.id);
    setFormData({ name: option.name, price: option.price });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ name: '', price: 0 });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('media_options')
      .update({ name: formData.name, price: formData.price })
      .eq('id', editingId);

    if (error) console.error('Update error:', error);
    else {
      cancelEditing();
      fetchMediaOptions();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-bg text-title">
      <h2 className="text-2xl font-bold mb-6">Media Options</h2>
      <table className="w-full text-sm border border-fg/30 shadow-sm">
        <thead className="bg-fg/10">
          <tr>
            <th className="p-2 border border-fg/30">Option Name</th>
            <th className="p-2 border border-fg/30 text-center">Price ($)</th>
            <th className="p-2 border border-fg/30 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mediaOptions.map((option) => (
            <tr key={option.id} className="hover:bg-fg/5">
              <td className="p-2 border border-fg/30">
                {editingId === option.id ? (
                  <input
                    className="border border-fg/20 bg-bg text-fg px-2 py-1 rounded w-full"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  option.name
                )}
              </td>
              <td className="p-2 border border-fg/30 text-center">
                {editingId === option.id ? (
                  <input
                    type="number"
                    className="border border-fg/20 bg-bg text-fg px-2 py-1 w-20 text-center rounded"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                ) : (
                  `$${option.price?.toFixed(2)}`
                )}
              </td>
              <td className="p-2 border border-fg/30 text-center">
                {editingId === option.id ? (
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
                    className="bg-fg text-white px-3 py-1 rounded"
                    onClick={() => startEditing(option)}
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

export default MediaOptions;
