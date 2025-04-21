import React, { useState, useEffect } from 'react';
import './Home.css';
import { Cart } from '../components/Cart';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // 新增：控制目录是否展开的状态
  const [isExpanded, setIsExpanded] = useState(false);
  // 新增：商品数据状态
  const [products, setProducts] = useState([]);
   // 新增：商品数据状态
  const [pageNum, setPageNum] = useState(1);
  // 新增：控制目录是否展开的状态
  const [isLoading, setIsLoading] = useState(false);
  // 在状态声明部分新增
  const [searchKeyword, setSearchKeyword] = useState('');
        
  // 新增搜索处理方法
  const handleSearch = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      try {
        setIsLoading(true);
        const searchRes = await fetch('http://117.72.72.114:9000/api/v1/main/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keyword: searchKeyword,
            page_size: 10,
            page_num: 1
          })
        });
        
        const searchData = await searchRes.json();
        
        // 修改后的数据验证逻辑
        if (searchData?.info === "success") {
          const skuList = searchData.data?.map(item => item.Sku) || [];
          navigate('/search-result', { 
            state: { 
              skuList,
              keyword: searchKeyword,
              searchStatus: skuList.length > 0 ? 'success' : 'empty'
            }
          });
        } else {
          throw new Error(searchData?.info || '未知错误');
        }
      } catch (err) {
        setError('搜索失败: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://117.72.72.114:9000/api/v1/home/category/head');
        if (response.ok) {
          const data = await response.json();
          if (data.msg === 'success') {
            setCategories(data.result);
            setError(''); // 成功获取数据时清空错误信息
          } else {
            setError(data.msg || '获取分类失败');
          }
        } else {
          setError('获取分类失败');
        }
      } catch (err) {
        console.error('Fetch categories error:', err);
        setError('网络错误，请稍后重试');
      }
    };

    fetchCategories();
  }, []);

  // 获取商品数据
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://117.72.72.114:9000/api/v1/main/random', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            page_num: pageNum,
            page_size: 9
          })
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(prevProducts => [...prevProducts, ...(data.data || [])]);
          
          setError('');
        } else {
          setError('获取商品数据失败');
        }
      } catch (err) {
        console.error('Fetch products error:', err);
        setError('网络错误，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [pageNum]);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      // 当距离页面底部 200px 时触发加载更多
      if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) { 
        setPageNum(prevPageNum => prevPageNum + 1);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  // 分类图标映射
  const categoryIcons = {
    '教材书籍': 'fas fa-book',
    '电子产品': 'fas fa-laptop',
    '服装饰品': 'fas fa-tshirt',
    '运动器材': 'fas fa-bicycle',
    '生活用品': 'fas fa-home',
    '书籍教材': 'fas fa-book',
    '服装鞋帽': 'fas fa-tshirt',
    '文具用品': 'fas fa-pencil-alt',
    // 修改为单车图标
    '交通工具': 'fas fa-bicycle',
    '数码配件': 'fas fa-microchip'
};

  return (
    <>
      <Header />
      <main className="main">
        <section className="hero-section">
          <h1 className="hero-title">发现校园好物</h1>
          <div className="search-box">
            <input 
              type="text" 
              className="search-input"
              placeholder="搜索你想要的商品..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button className="search-button" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </section>

        {error && error!== 'success' && <div className="error-message">{error}</div>}

        {/* <div className={`category-list ${isExpanded ? 'expanded' : ''}`}> */}
        <div className={`category-list category-list-8 ${isExpanded ? 'expanded' : ''}`}>
          {categories.slice(0, isExpanded ? categories.length : 10).map(category => (
            <div key={category.id} className="category-item">
              <i className={categoryIcons[category.name] || 'fas fa-tag'}></i>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
        {/* {categories.length > 4 && (
          <div className="category-item expand-arrow" 
               onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '收起 ▲' : '展开 ▼'}
          </div>
        )} */}
        <div className="product-grid">
          {console.log(products)}
          {products.map(product => (
            <ProductCard key={product.goods_id} product={product} />
          ))}
          {isLoading && <div>加载中...</div>}
        </div>
      </main>
      <Footer/>
      {/* <Cart /> */}
    </>
  );
}

export default Home;