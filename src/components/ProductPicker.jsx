const mockProducts = [
  { id: 'p1', name: '14K Tandem', price: 299 },
  { id: 'p2', name: 'Video Add-On', price: 99 },
  { id: 'p3', name: 'T-Shirt', price: 25 },
];

export default function ProductPicker({ onAdd }) {
  return (
    <div className="p-4 bg-white border shadow rounded space-y-4">
      <h2 className="text-xl font-bold">Products</h2>
      <ul className="grid grid-cols-2 gap-4">
        {mockProducts.map((product) => (
          <li key={product.id} className="p-2 border rounded hover:bg-gray-100 cursor-pointer" onClick={() => onAdd(product)}>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
