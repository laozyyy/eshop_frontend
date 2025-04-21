import './SearchResultsPage.css';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

function SearchResultsPage() {
  const location = useLocation();
  const { skuList = [], keyword } = location.state || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productPromises = skuList.map(async (sku) => {
          const response = await fetch(`http://117.72.72.114:9000/api/v1/main/get_sku/${sku}`);
          return response.json();
        });

        const results = await Promise.all(productPromises);
        setProducts(results.map(res => res.data));
      } catch (err) {
        setError('获取商品详情失败: ' + err.message);
      } finally {
        setLoading(false);  // 正确的loading状态更新位置
      }
    };

    if (skuList.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);  // 处理空skuList的情况
    }
  }, [skuList]);

  // 修改后的渲染逻辑
  return (
    <div>
      <Header />
      <main className="search-results-container">
       
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : products.length === 0 ? (
            <h2>没有找到与 "<span>{keyword}</span>" 相关的商品</h2>
        ) : (
            <>
            <h2>&nbsp;&nbsp;&nbsp;搜索 "<span>{keyword}</span>" 的结果（共{products.length}条）</h2>
          <div className="product-grid">
            {products.map(product => (
              <ProductCard 
                key={product.Sku}
                product={{
                  ...product,
                  Sku: product.Sku,
                  price: product.Price,
                  name: product.Name,
                  show_pic: product.ShowPic?.[0]
                }}
              />
            ))}
          </div>
          </>
        )}
      </main>
    </div>
  );
}

export default SearchResultsPage;