import React, { useRef, useState } from 'react';
import CheckedInSidebar from '../../components/CheckedInSidebar';
import LoadCard from '../../components/LoadCard';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useJumpers } from '../../contexts/JumpersContext';

function ManifestView() {
  const { jumpers, updateJumper, setJumpers } = useJumpers();
  const loadRefs = useRef([]);
  const [activeJumper, setActiveJumper] = useState(null);

  const updateJumperStatus = (id, status) => {
    updateJumper(id, { status });
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const jumper = jumpers.find(j => j.id === active.id || j.name === active.id);
    setActiveJumper(jumper || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveJumper(null);
    if (!active || !over) return;

    const jumperId = active.id;
    const jumper = jumpers.find(j => j.id === jumperId || j.name === jumperId);
    if (!jumper) return;

    const jumperName = jumper.name;
    const slotMatch = over.id.match(/^slot-(\d+)-(\d+)$/);

    if (over.id.startsWith('checked')) {
      updateJumper(jumper.id, { status: 'checked in' });

      loadRefs.current.forEach((ref) => {
        if (ref?.getSlots && ref.assignJumperToSlot) {
          const slots = ref.getSlots();
          const index = slots.findIndex((s) => s?.startsWith(jumperName));
          if (index !== -1) ref.assignJumperToSlot(index, null);
        }
      });
      return;
    }

    if (!slotMatch) return;

    const loadIndex = parseInt(slotMatch[1], 10) - 1;
    const slotIndex = parseInt(slotMatch[2], 10);

    loadRefs.current.forEach((ref) => {
      if (ref?.getSlots && ref.assignJumperToSlot) {
        const slots = ref.getSlots();
        const index = slots.findIndex((s) => s?.startsWith(jumperName));
        if (index !== -1) ref.assignJumperToSlot(index, null);
      }
    });

    const loadRef = loadRefs.current[loadIndex];
    if (loadRef?.assignJumperToSlot) {
      loadRef.assignJumperToSlot(slotIndex, jumperName);
      updateJumper(jumper.id, { status: 'manifested' });
    }
  };

  const handleLoadStatusChange = (loadNum, newStatus) => {
    if (newStatus === 'Up' || newStatus === 'Done') {
      const loadRef = loadRefs.current[loadNum - 1];
      if (!loadRef?.getSlots) return;

      const slots = loadRef.getSlots();
      const jumperIds = slots
        .filter((s) => s && !s.includes('(TI)') && !s.includes('(Video)'))
        .map((s) => s?.split(' (')[0]);

      setJumpers((prev) =>
        prev.map((j) =>
          jumperIds.includes(j.id) ? { ...j, status: 'jumped' } : j
        )
      );
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex">
        <CheckedInSidebar
          handleEditClick={(s) => console.log('Edit', s)}
          handleRemove={(id) => updateJumperStatus(id, 'arrived')}
        />
        <div className="flex flex-col gap-4 w-full p-4">
          {[1, 2, 3, 4, 5, 6].map((loadNum, index) => (
            <LoadCard
              key={loadNum}
              loadNum={loadNum}
              ref={(el) => (loadRefs.current[index] = el)}
              onStatusChange={(status) => handleLoadStatusChange(loadNum, status)}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeJumper ? (
          <div className="p-2 bg-white border border-gray-400 rounded shadow text-fg font-semibold">
            {activeJumper.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default ManifestView;
