// WaiversView.jsx (with Supabase integration)
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

function WaiversView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [waivers, setWaivers] = useState([]);

  useEffect(() => {
    const fetchJumpers = async () => {
      const { data, error } = await supabase.from('jumpers').select('*').order('created_at', { ascending: false });
      if (!error) setWaivers(data);
      else console.error('Error loading waivers:', error);
    };
    fetchJumpers();
  }, []);

  const filteredWaivers = waivers.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || w.status === statusFilter)
  );

  return (
    <div className="p-8 bg-bg text-fg min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-title">All Waivers</h1>
        <input
          type="text"
          placeholder="Search jumpers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered border border-border bg-bg text-fg px-3 py-2 rounded-lg w-1/3"
        />
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium text-sm text-fg">Filter by Status:</label>
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="waivered">Waivered</option>
          <option value="arrived">Arrived</option>
          <option value="checked in">Checked In</option>
          <option value="manifested">Manifested</option>
          <option value="jumped">Jumped</option>
          <option value="rescheduled">Rescheduled</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-auto rounded-lg shadow border border-border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-fg text-button-text text-left text-xs font-semibold uppercase tracking-wider">
              <th className="px-4 py-3 border-b border-border">Name</th>
              <th className="px-4 py-3 border-b border-border">Email</th>
              <th className="px-4 py-3 border-b border-border">Group ID</th>
              <th className="px-4 py-3 border-b border-border">Altitude</th>
              <th className="px-4 py-3 border-b border-border">Media</th>
              <th className="px-4 py-3 border-b border-border text-right">Weight</th>
              <th className="px-4 py-3 border-b border-border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredWaivers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted py-8">
                  No waivers found.
                </td>
              </tr>
            ) : (
              filteredWaivers.map((w, i) => (
                <tr
                  key={w.id || i}
                  className={`border-b border-border ${i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                >
                  <td className="font-bold text-gray-800 px-4 py-3 whitespace-nowrap">{w.name}</td>
                  <td className="text-gray-700 px-4 py-3 truncate max-w-xs">{w.email}</td>
                  <td className="text-gray-800 px-4 py-3">{w.groupId || '-'}</td>
                  <td className="text-gray-800 px-4 py-3">{w.altitude}</td>
                  <td className="text-gray-800 px-4 py-3">{w.media}</td>
                  <td className="text-gray-800 px-4 py-3 text-right">{w.weight}</td>
                  <td className="text-gray-800 px-4 py-3 capitalize">{w.status || 'waivered'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WaiversView;
