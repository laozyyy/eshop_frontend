import { useCart } from '../contexts/CartContext';

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>¥{product.price}</p>
      <button onClick={() => addToCart(product)}>
        加入购物车
      </button>
    </div>
  );
} 