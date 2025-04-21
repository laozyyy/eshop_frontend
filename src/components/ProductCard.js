import React from 'react';

function ProductCard({ product, isLottery = false }) {
  return (
    <div key={product.Sku} className="product-card" onClick={() => window.location.href = `/product/${product.Sku}`} style={{cursor: 'pointer'}}>
      <img src={product.ShowPic} 
           className="product-image" 
           alt={product.Name} />
      
        {!isLottery && (
          // 这里放置你想要渲染的内容，根据上下文推测应该是原本 isLottery 为 true 时渲染的内容
          <><div className="product-info">
            <h3 className="product-title">{product.Name}</h3>
            <div className="product-meta">
              <div className="product-price">¥{product.Price}</div>
              <div className="product-seller">{product.seller_name}</div>
            </div></div>
          </>
        )}
      
    </div>
  );
}

export default ProductCard;