import { useState, useEffect } from 'react';
import CheckedInSidebar from '../../components/CheckedInSidebar';
import { useJumpers } from '../../contexts/JumpersContext';
import { supabase } from '../../lib/supabaseClient';

function CheckInView() {
  const { jumpers, updateJumper, reload } = useJumpers();

  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [groupEditData, setGroupEditData] = useState({ name: '', size: 1 });

  const altitudeOptions = ['10K Tandem', '14K Tandem', '17K Tandem'];
  const mediaOptions = ['None', 'Video', 'Photos', 'Both', 'Undecided', 'Outside Video'];

  const availableGroups = [
    ...new Set(jumpers
      .filter(j => ['arrived', 'checked in', 'manifested'].includes(j.status))
      .map(j => j.group_name)
      .filter(name => !!name && name !== 'Single Jumper'))
  ];

  const resolveGroupName = async () => {
    if (formData.group_name === 'New Group') {
      const { data, error } = await supabase.from('groups').insert([{
        group_name: groupEditData.name,
        size: groupEditData.size || 1,
      }]).select();

      if (error || !data) {
        alert("Failed to create group.");
        return null;
      }

      return data[0].group_name;
    }

    return formData.group_name;
  };

  const handleSave = async () => {
    if (!formData.name) return;

    const resolvedGroupName = await resolveGroupName();
    if (resolvedGroupName === null) return;

    const newFormData = { ...formData, group_name: resolvedGroupName };

    if (isNew) {
      await supabase.from('jumpers').insert([newFormData]);
    } else {
      await updateJumper(formData.id, newFormData);
    }

    await reload();
    setSelected(null);
    setIsNew(false);
  };

  const handleDelete = async () => {
    await supabase.from('jumpers').delete().eq('id', formData.id);
    await reload();
    setSelected(null);
  };

  const handleCheckIn = async () => {
    if (!formData.id) return;

    const resolvedGroupName = await resolveGroupName();
    if (resolvedGroupName === null) return;

    await updateJumper(formData.id, {
      ...formData,
      group_name: resolvedGroupName,
      status: 'checked in',
      checked_in: true,
    });

    await reload();
    setSelected(null);
  };

  return (
    <div className="flex flex-col bg-bg text-fg">
      <div className="w-full p-6">
        <h1 className="text-5xl font-bold text-title mb-6">Tandem Check In</h1>
      </div>
      <div className="flex">
        <div className="w-2/3 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-title">Waivers</h1>
            <button className="btn bg-accent text-button-text border rounded-md px-2 py-1" onClick={() => {
              setFormData({ name: '', email: '', altitude: '14K Tandem', media: 'Undecided', group_name: '' });
              setIsNew(true);
              setSelected({});
            }}>
              + Add Jumper
            </button>
          </div>

          <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-bordered border rounded-md px-1 w-full" />

          {jumpers
            .filter(j => !j.checked_in)
            .filter(j => j.name?.toLowerCase().includes(search.toLowerCase()))
            .map((student, i) => (
              <div key={i} className="card bg-gray-100 border shadow cursor-pointer" onClick={() => {
                setFormData(student);
                setSelected(student);
                setIsNew(false);
              }}>
                <div className="card-body px-3 py-2">
                  <h2 className="font-semibold">{student.name}</h2>
                  <p className="text-sm">{student.email}</p>
                </div>
              </div>
            ))}
        </div>

        <CheckedInSidebar
          jumpers={jumpers}
          handleEditClick={(s) => {
            setSelected(s);
            setFormData(s);
          }}
          handleRemove={async (id) => await updateJumper(id, { group_name: null, status: 'arrived', checked_in: false })}
        />
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-[28rem]">
            <h3 className="text-xl font-bold mb-4">Jumper Info</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input className="input w-full border rounded-md px-1" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input className="input w-full border rounded-md px-1" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Altitude</label>
                <select className="input w-full border rounded-md px-1" value={formData.altitude} onChange={(e) => setFormData({ ...formData, altitude: e.target.value })}>
                  {altitudeOptions.map((alt, i) => <option key={i}>{alt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Media</label>
                <select className="input w-full border rounded-md px-1" value={formData.media} onChange={(e) => setFormData({ ...formData, media: e.target.value })}>
                  {mediaOptions.map((m, i) => <option key={i}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Weight</label>
                <input className="input w-full border rounded-md px-1" placeholder="Weight" type="number" value={formData.weight || ''} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Notes</label>
                <textarea className="textarea w-full border rounded-md px-1" placeholder="Notes" value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Group</label>
                <select
                  className="input input-bordered w-full"
                  value={formData.group_name || ''}
                  onChange={(e) => setFormData({ ...formData, group_name: e.target.value || null })}
                >
                  <option value="">-- Select Group --</option>
                  {availableGroups.map((g, i) => (
                    <option key={i} value={g}>{g}</option>
                  ))}
                  <option value="Single Jumper">Single Jumper</option>
                  <option value="New Group">+ Create New Group</option>
                </select>
                {formData.group_name === 'New Group' && (
                  <>
                    <label className="text-sm text-gray-600">New Group Name</label>
                    <input className="input input-bordered border px-1 rounded-md w-full mb-2" value={groupEditData.name || ''} onChange={(e) => setGroupEditData({ ...groupEditData, name: e.target.value })} placeholder="Group Name" />
                    <label className="text-sm text-gray-600">Group Size</label>
                    <input className="input input-bordered border rounded-md px-1 w-full" type="number" value={groupEditData.size || 1} onChange={(e) => setGroupEditData({ ...groupEditData, size: parseInt(e.target.value) || 1 })} placeholder="Group Size" />
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button className="btn bg-title rounded-md px-2 py-1 text-white" onClick={handleDelete}>Delete</button>
              <div className="space-x-2">
                <button className="btn" onClick={() => setSelected(null)}>Cancel</button>
                <button className="btn bg-fg rounded-md px-2 py-1 text-white" onClick={handleSave}>Save</button>
                <button className="btn bg-fg rounded-md px-2 py-1 text-white" onClick={handleCheckIn}>Check In</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckInView;
