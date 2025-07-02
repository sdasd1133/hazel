import { Metadata } from "next";
import ClientProductsPage from "./client-page";

export const metadata: Metadata = {
  title: "전체 상품 - HAZEL",
  description: "HAZEL의 모든 상품을 확인하세요.",
};

export default function ProductsPage() {
  return <ClientProductsPage />;
  
  // 선택된 상위 카테고리
  const selectedParent = searchParams.parent;
  
  // 선택된 하위 카테고리
  const selectedCategory = searchParams.category;

  // 현재 표시할 카테고리들 (상위 카테고리가 선택된 경우 해당 하위 카테고리들)
  const currentCategories = selectedParent 
    ? getCategoriesByParent(selectedParent)
    : categories;
  
  // 카테고리 필터링
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory)
    : selectedParent
      ? getProductsByParentCategory(selectedParent)
      : products;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">
        {searchParams.category 
          ? `${categories.find(cat => cat.id === searchParams.category)?.name || '상품'} 컬렉션`
          : searchParams.parent
            ? `${parentCategories.find(cat => cat.id === searchParams.parent)?.name || '상품'} 컬렉션`
            : '전체 상품'}
      </h1>

      {/* 상위 카테고리 필터 */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <a 
            href="/products" 
            className={`whitespace-nowrap px-4 py-2 rounded-full ${!searchParams.parent && !searchParams.category ? 'bg-black text-white' : 'bg-gray-100'}`}
          >
            전체
          </a>
          
          {parentCategories.map(category => (
            <a
              key={category.id}
              href={`/products?parent=${category.id}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full ${
                searchParams.parent === category.id ? 'bg-black text-white' : 'bg-gray-100'
              }`}
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>

      {/* 하위 카테고리 필터 */}
      {searchParams.parent && (
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <a
              href={`/products?parent=${searchParams.parent}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full ${
                !searchParams.category ? 'bg-black text-white' : 'bg-gray-100'
              }`}
            >
              전체
            </a>
            
            {currentCategories.map(category => (
              <a
                key={category.id}
                href={`/products?category=${category.id}&parent=${searchParams.parent}`}
                className={`whitespace-nowrap px-4 py-2 rounded-full ${
                  searchParams.category === category.id ? 'bg-black text-white' : 'bg-gray-100'
                }`}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 하위 카테고리 필터 (상위 카테고리가 선택되지 않은 경우) */}
      {!searchParams.parent && (
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {categories.map(category => (
              <a
                key={category.id}
                href={`/products?category=${category.id}`}
                className={`whitespace-nowrap px-4 py-2 rounded-full ${
                  searchParams.category === category.id ? 'bg-black text-white' : 'bg-gray-100'
                }`}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 상품 그리드 */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-medium mb-2">상품이 없습니다</h2>
          <p className="text-gray-500">다른 카테고리를 확인해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
