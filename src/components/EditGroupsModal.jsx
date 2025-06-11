import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function EditGroupsModal({ onClose, jumpers, reload }) {
  const [groups, setGroups] = useState([]);
  const [edits, setEdits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch groups from Supabase
  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      const { data, error } = await supabase.from('groups').select('*'); // <-- use supabase, not window.supabase
      if (!error) setGroups(data);
      setLoading(false);
    }
    fetchGroups();
  }, []);

  // Filter out groups with jumpers in "jumped" status
  useEffect(() => {
    if (!groups.length) return;
    const groupsWithJumped = new Set(
      jumpers.filter(j => j.status === 'jumped' && j.group_name).map(j => j.group_name)
    );
    const editable = groups.filter(g => !groupsWithJumped.has(g.group_name));
    setEdits(editable.map(g => ({ ...g })));
  }, [groups, jumpers]);

  const handleChange = (idx, field, value) => {
    setEdits(edits =>
      edits.map((g, i) => (i === idx ? { ...g, [field]: value } : g))
    );
  };

  const handleSave = async () => {
    for (const group of edits) {
      await supabase // <-- use supabase, not window.supabase
        .from('groups')
        .update({ group_name: group.group_name, size: group.size })
        .eq('id', group.id);
    }
    await reload();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 shadow-lg w-[28rem]">
        <h3 className="text-xl font-bold rounded-md mb-4">View Groups</h3>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {edits.length === 0 && (
              <div className="text-gray-500">No editable groups found.</div>
            )}
            {edits.map((group, idx) => (
              <div key={group.id} className="flex items-center gap-2">
                <input
                  className="input input-bordered border rounded-md px-1 w-1/2"
                  value={group.group_name}
                  onChange={e => handleChange(idx, 'group_name', e.target.value)}
                  placeholder="Group Name"
                />
                <input
                  className="input input-bordered border rounded-md px-1 w-1/4"
                  type="number"
                  min={1}
                  value={group.size || ''}
                  onChange={e => handleChange(idx, 'size', parseInt(e.target.value) || 1)}
                  placeholder="Size"
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-4 space-x-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn bg-accent rounded px-2 text-white" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditGroupsModal;