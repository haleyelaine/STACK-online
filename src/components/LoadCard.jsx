import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { Minus, Plus } from 'lucide-react';

const LoadCard = forwardRef(
  ({ loadNum, onJumperAssigned, onJumperDragged, onStatusChange }, ref) => {
    const [minimized, setMinimized] = useState(false);
    const [status, setStatus] = useState('Not Building');
    const [slots, setSlots] = useState(Array(12).fill(null));
    const [modalVisible, setModalVisible] = useState(false);
    const [activeSlotIndex, setActiveSlotIndex] = useState(null);
    const [selectedJumper, setSelectedJumper] = useState('');
    const [selectedJumpType, setSelectedJumpType] = useState('');
    const [selectedTI, setSelectedTI] = useState('');

    useImperativeHandle(ref, () => ({
      assignJumperToSlot: (slotIndex, jumperName) => {
        setSlots((prev) => {
          const updated = [...prev];
          updated[slotIndex] = jumperName ? `${jumperName} (Tandem)` : null;
          return updated;
        });
        if (jumperName && onJumperAssigned) onJumperAssigned(jumperName);
      },
      getSlots: () => slots,
      removeJumper: (jumperName) => {
        setSlots((prev) =>
          prev.map((s) => (s?.startsWith(jumperName) ? null : s))
        );
      },
    }));

    useEffect(() => {
      if (status === 'Not Building' && slots.some((slot) => slot !== null)) {
        setStatus('Building');
      }
    }, [slots, status]);

    useEffect(() => {
      if (onStatusChange) {
        onStatusChange(loadNum, status);
      }
    }, [status]);

    const handleSlotClick = (i) => {
      const slot = slots[i];
      if (!slot) return;
      setActiveSlotIndex(i);
      const jumperMatch = slot.match(/^(.*?) \(/);
      const typeMatch = slot.match(/\((.*?)\)/);
      if (jumperMatch) setSelectedJumper(jumperMatch[1]);
      if (typeMatch) setSelectedJumpType(typeMatch[1]);
      setModalVisible(true);
    };

    const handleAssign = () => {
      if (selectedJumper && selectedJumpType) {
        const newSlots = [...slots];
        newSlots[activeSlotIndex] = `${selectedJumper} (${selectedJumpType})`;
        setSlots(newSlots);
        setModalVisible(false);
        if (onJumperAssigned) onJumperAssigned(selectedJumper);
      }
    };

    const handleRemove = (i) => {
      const newSlots = [...slots];
      newSlots[i] = null;
      setSlots(newSlots);
    };

    const statusOptions = ['Not Building', 'Building', 'On Call', 'Up', 'Done'];
    const jumperOptions = ['CJ Surface', 'Brooke DeWitt', 'Rico Zoom'];
    const jumpTypes = [
      'Tandem',
      'Tandem with Outside Video',
      'AFF (2 Instructor)',
      'AFF (1 Instructor)',
      'Coached',
      'Solo Student',
      'Belly',
      'Freefly',
      'Movement',
      'CRW',
      'Wingsuit',
      'Hop n Pop',
      'TI',
      'Videographer',
    ];
    const tiOptions = ['Dave Vincent', 'Emma Skies', 'Tara Jumpmaster'];
    const videographerOptions = ['Victor Clip', 'Nina Frame', 'Jason FlyCam'];

    const statusColors = {
      'Not Building': 'bg-white text-gray-500',
      'Building': 'bg-stone-300 text-black',
      'On Call': 'bg-blue-500 text-white',
      'Up': 'bg-lime-500 text-black',
      'Done': 'bg-neutral-950 text-white',
    };

    return (
      <div className={`bg-bg text-accent shadow rounded border border-border w-full relative transition-all duration-200`}>
        <div className={`flex justify-between items-center mb-2 p-4 rounded-t ${statusColors[status]}`}>
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">Load {loadNum}</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-sm font-semibold rounded px-2 py-1 appearance-none border focus:outline-none focus:ring-1 text-center bg-white text-gray-800"
              style={{ textAlignLast: 'center' }}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option} className="text-gray-500">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button className="hover:text-accent" onClick={() => setMinimized(!minimized)}>
            {minimized ? <Plus size={18} /> : <Minus size={18} />}
          </button>
        </div>

        {!minimized && (
          <div className="grid grid-cols-2 gap-2 p-4">
            {slots.map((slot, i) => {
              const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `slot-${loadNum}-${i}` });
              const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({
                id: slot?.split(' (')[0] || `slot-${loadNum}-${i}`,
                data: { slotIndex: i, loadNum, slot },
                disabled: !slot,
              });

              return (
                <div
                  key={i}
                  ref={(el) => {
                    setDropRef(el);
                    setDragRef(el);
                  }}
                  {...(slot ? { ...attributes, ...listeners } : {})}
                  className={`p-2 text-center text-sm rounded cursor-pointer transition-all duration-200 text-fg border-slot-border ${
                    slot ? 'bg-slot-filled border font-semibold hover:bg-hover' : 'bg-slot-empty hover:bg-hover'
                  } ${isOver ? 'ring-2 ring-accent ring-offset-2' : ''}`}
                  onClick={() => handleSlotClick(i)}
                >
                  {slot || `Slot ${i + 1}`}
                </div>
              );
            })}
          </div>
        )}

        {modalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-bg text-accent p-6 rounded shadow-lg w-96 border border-border">
              <h3 className="text-lg font-bold mb-2">Assign Jumper</h3>

              <label className="text-sm text-left block w-full pb-1">Jump Type</label>
              <select
                className="w-full mb-2 border border-border rounded px-2 py-1"
                value={selectedJumpType}
                onChange={(e) => setSelectedJumpType(e.target.value)}
              >
                <option value="">Select Jump Type</option>
                {jumpTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {!['TI', 'Videographer'].includes(selectedJumpType) && (
                <>
                  <label className="text-sm text-left block w-full pb-1">Jumper</label>
                  <select
                    className="w-full mb-2 border border-border rounded px-2 py-1"
                    value={selectedJumper}
                    onChange={(e) => setSelectedJumper(e.target.value)}
                  >
                    <option value="">Select Jumper</option>
                    {jumperOptions.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {['TI', 'Videographer'].includes(selectedJumpType) && (
                <>
                  <label className="text-sm text-left block w-full">
                    {selectedJumpType === 'TI' ? 'TI' : 'Videographer'}
                  </label>
                  <select
                    className="w-full mb-4 border border-border rounded px-2 py-1"
                    value={selectedTI}
                    onChange={(e) => setSelectedTI(e.target.value)}
                  >
                    <option value="">Select {selectedJumpType}</option>
                    {(selectedJumpType === 'TI' ? tiOptions : videographerOptions).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <div className="flex justify-between items-center mb-2 pb-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => {
                    handleRemove(activeSlotIndex);
                    setModalVisible(false);
                  }}
                >
                  Remove Jumper
                </button>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-border text-bg rounded" onClick={() => setModalVisible(false)}>
                    Cancel
                  </button>
                  <button className="px-3 py-1 bg-accent text-button-text rounded" onClick={handleAssign}>
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default LoadCard;
