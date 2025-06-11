import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function TandemAltitudes() {
  const [altitudes, setAltitudes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: 0 });

  useEffect(() => {
    fetchAltitudes();
  }, []);

const fetchAltitudes = async () => {
  const { data, error } = await supabase
    .from('tandem_altitudes')
    .select('*')
    .order('price', { ascending: true }); // or 'name' or whatever you want

  if (error) console.error('Error fetching altitudes:', error);
  else setAltitudes(data);
};

  const startEditing = (altitude) => {
    setEditingId(altitude.id);
    setFormData({ name: altitude.name, price: altitude.price });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ name: '', price: 0 });
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('tandem_altitudes')
      .update({ name: formData.name, price: formData.price })
      .eq('id', editingId);

    if (error) console.error('Update error:', error);
    else {
      cancelEditing();
      fetchAltitudes();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Tandem Altitudes</h2>
      <table className="w-full text-sm border border-gray-300 shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Altitude Name</th>
            <th className="p-2 border text-center">Price ($)</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {altitudes.map((alt) => (
            <tr key={alt.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {editingId === alt.id ? (
                  <input
                    className="border px-2 py-1 rounded w-full"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  alt.name
                )}
              </td>
              <td className="p-2 border text-center">
                {editingId === alt.id ? (
                  <input
                    type="number"
                    className="border px-2 py-1 w-20 text-center rounded"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                ) : (
                  `$${alt.price?.toFixed(2)}`
                )}
              </td>
              <td className="p-2 border text-center">
                {editingId === alt.id ? (
                  <div className="flex gap-2 justify-center">
                    <button
                      className="bg-gray-300 px-3 py-1 rounded"
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
                    onClick={() => startEditing(alt)}
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

export default TandemAltitudes;
