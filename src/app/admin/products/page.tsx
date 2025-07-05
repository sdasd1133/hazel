'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Product } from '@/types/supabase';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 실제 구현에서는 API 호출을 통해 상품 목록을 가져옵니다.
    // 현재는 예시 데이터를 사용합니다.
    const fetchProducts = async () => {
      try {
        // 실제로는 Supabase 또는 API 호출
        setTimeout(() => {
          const dummyProducts: Product[] = [
            {
              id: '1',
              name: '오버사이즈 캐시미어 니트',
              price: 89000,
              category: 'knit',
              description: '고급 캐시미어 소재의 오버사이즈 니트',
              images: ['/dummy-image.jpg'],
              sizes: ['S', 'M', 'L', 'XL'],
              colors: ['Black', 'White', 'Gray'],
              inStock: true,
              isFeatured: true,
            },
            {
              id: '2',
              name: '와이드핏 데님 팬츠',
              price: 78000,
              category: 'pants',
              description: '편안한 착용감의 와이드핏 데님 팬츠',
              images: ['/dummy-image.jpg'],
              sizes: ['S', 'M', 'L'],
              colors: ['Blue', 'Black'],
              inStock: true,
            },
            {
              id: '3',
              name: '울 블렌드 코트',
              price: 239000,
              category: 'outer',
              description: '고급 울 소재의 블렌드 코트',
              images: ['/dummy-image.jpg'],
              sizes: ['S', 'M', 'L'],
              colors: ['Beige', 'Black'],
              inStock: true,
            },
          ];
          
          setProducts(dummyProducts);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('상품을 불러오는 데 실패했습니다:', error);
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('이 상품을 삭제하시겠습니까?')) {
      // 실제 구현에서는 API 호출을 통해 상품을 삭제합니다.
      try {
        // 실제로는 Supabase 또는 API 호출
        console.log(`상품 ID ${id} 삭제 요청`);
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('상품 삭제에 실패했습니다:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>상품 추가</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="상품명 또는 카테고리 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">로딩 중...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 상품이 없습니다.'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품명
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200"></div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₩{product.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.inStock ? '재고 있음' : '품절'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/products/edit/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded"
                        >
                          <Pencil className="h-5 w-5" />
                          <span className="sr-only">편집</span>
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">삭제</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
