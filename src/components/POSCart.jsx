export default function POSCart({ items = [], onUpdate, onRemove, onCheckout }) {
  const subtotal = items.reduce((sum, item) => sum + item.price_each * item.quantity, 0);

  return (
    <div className="p-4 bg-white border shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Cart is empty.</p>
      ) : (
        <ul className="space-y-2">
          {items.map(({ product, quantity, price_each }) => (
            <li key={product.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">
                  Qty: {quantity} × ${price_each.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm" onClick={() => onUpdate(product.id, { quantity: quantity + 1 })}>+</button>
                <button className="btn btn-sm" onClick={() => onUpdate(product.id, { quantity: Math.max(1, quantity - 1) })}>-</button>
                <button className="btn btn-sm btn-error" onClick={() => onRemove(product.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pt-2 border-t font-bold text-lg">
        Subtotal: ${subtotal.toFixed(2)}
      </div>

      {items.length > 0 && (
        <button className="btn btn-primary w-full" onClick={onCheckout}>Checkout</button>
      )}
    </div>
  );
}
