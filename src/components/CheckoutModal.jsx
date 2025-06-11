import { useState } from 'react';

export default function CheckoutModal({ cart = [], onClose, onComplete }) {
  const [payments, setPayments] = useState([{ method: 'cash', amount: 0 }]);
  const [giftCode, setGiftCode] = useState('');
  const total = cart.reduce((sum, item) => sum + item.price_each * item.quantity, 0);

  const updatePayment = (index, key, value) => {
    const updated = [...payments];
    updated[index][key] = key === 'amount' ? parseFloat(value) || 0 : value;
    setPayments(updated);
  };

  const addPayment = () => {
    setPayments([...payments, { method: 'cash', amount: 0 }]);
  };

  const removePayment = (index) => {
    const updated = payments.filter((_, i) => i !== index);
    setPayments(updated);
  };

  const paymentTotal = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleConfirm = () => {
    if (Math.abs(paymentTotal - total) > 0.01) {
      alert("Payment total must match the cart total");
      return;
    }
    onComplete({ payments, giftCode });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>
        <p className="mb-4">Total: ${total.toFixed(2)}</p>

        <div className="space-y-3 mb-4">
          {payments.map((p, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select
                className="border p-2 rounded flex-1"
                value={p.method}
                onChange={(e) => updatePayment(i, 'method', e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="account">Account</option>
                <option value="gift">Gift Certificate</option>
              </select>
              <input
                type="number"
                className="border p-2 rounded w-24"
                value={p.amount}
                onChange={(e) => updatePayment(i, 'amount', e.target.value)}
              />
              {payments.length > 1 && (
                <button onClick={() => removePayment(i)} className="btn btn-sm btn-error">X</button>
              )}
            </div>
          ))}
          <button onClick={addPayment} className="btn btn-sm">+ Add Payment Method</button>
        </div>

        {payments.some(p => p.method === 'gift') && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Gift Certificate Code</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="Enter gift code"
              value={giftCode}
              onChange={(e) => setGiftCode(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm}>Confirm Sale</button>
        </div>
      </div>
    </div>
  );
}