import { XMarkIcon } from '@heroicons/react/24/solid';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useJumpers } from '../contexts/JumpersContext';
import EditGroupsModal from './EditGroupsModal';
import { useState } from 'react';

function DraggableJumper({ jumper, handleEditClick, handleRemove, groupName, groupSize }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: jumper.id,
  });

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="shadow-sm rounded bg-fg/5 cursor-pointer transition hover:bg-fg/10"
      onClick={() => handleEditClick(jumper)}
    >
      <div className="p-4 flex bg-bg flex-row justify-between rounded-md items-center">
        <div>
          <p className="text-lg font-bold">{jumper.name}</p>
          <p className="text-s text-fg/70">
            {groupName || 'No Group'}
            {groupSize ? ` (${groupSize})` : ''}
          </p>
          <p className="text-s text-fg/70">{jumper.weight ? `${jumper.weight} lbs` : 'lbs'}</p>
        </div>
        <button
          onClick={async (e) => {
            e.stopPropagation();
            await handleRemove(jumper.id);
          }}
          className="btn btn-sm btn-ghost text-fg"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

function CheckedInSidebar({ handleEditClick, handleRemove }) {
  const { jumpers, reload } = useJumpers();
  const checkedIn = jumpers.filter((j) => j.status === 'checked in');

  const { setNodeRef } = useDroppable({ id: 'checked-in' });

  // Calculate group sizes
  const groupCounts = {};
  jumpers.forEach(j => {
    const group = j.group_name || 'No Group';
    groupCounts[group] = (groupCounts[group] || 0) + 1;
  });

  const handleRemoveAndReload = async (id) => {
    await handleRemove(id);
    reload();
  };

  const [showGroupModal, setShowGroupModal] = useState(false);

  return (
    <div ref={setNodeRef} className="w-1/3 p-6 bg-hover text-fg rounded-md border border-border">
      <h2 className="text-2xl font-bold text-accent mb-4">Checked In</h2>
      <button
        className="btn btn-sm mb-4 bg-accent text-white rounded-md px-2"
        onClick={() => setShowGroupModal(true)}
      >
        View Groups
      </button>
      <ul className="space-y-3">
        {checkedIn.map((s) => (
          <DraggableJumper
            key={s.id}
            jumper={s}
            handleEditClick={handleEditClick}
            handleRemove={handleRemoveAndReload}
            groupName={s.group_name || 'No Group'}
            groupSize={groupCounts[s.group_name || 'No Group']}
          />
        ))}
      </ul>
      {showGroupModal && (
        <EditGroupsModal
          onClose={() => setShowGroupModal(false)}
          jumpers={jumpers}
          reload={reload}
        />
      )}
    </div>
  );
}

export default CheckedInSidebar;
