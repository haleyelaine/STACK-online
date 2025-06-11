import { useState } from 'react';
import POSCart from '../../components/POSCart';
import ProductPicker from '../../components/ProductPicker';
import CheckoutModal from '../../components/CheckoutModal';
import { buildCartFromJumpers } from '../../utils/buildCartFromJumper';

export default function POSDashboard() {
  const [cart, setCart] = useState([]); // cart items: { jumperId, jumperName, product, quantity, price_each }
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedJumpers, setSelectedJumpers] = useState([]); // jumper objects

  const addJumpersToCart = (jumpers) => {
    const newItems = buildCartFromJumpers(jumpers);
    setCart((prev) => [...prev, ...newItems]);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) =>
        item.product.id === product.id && !item.jumperId
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && !item.jumperId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, price_each: product.price }];
    });
  };

  const updateCartItem = (index, updates) => {
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const removeCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      <div className="col-span-2 space-y-4">
        <ProductPicker onAdd={addToCart} />

        {/* ⬇️ Add jumper loader/select here eventually */}
        <button
          className="btn bg-accent text-white"
          onClick={() => addJumpersToCart(selectedJumpers)}
        >
          Add Selected Jumpers to Cart
        </button>
      </div>

      <div>
        <POSCart
          items={cart}
          onUpdate={updateCartItem}
          onRemove={removeCartItem}
          onCheckout={() => setShowCheckout(true)}
        />
      </div>

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onComplete={() => {
            clearCart();
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
}
