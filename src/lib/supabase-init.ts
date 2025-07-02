import { supabase } from '@/lib/supabase';
import { products, parentCategories, categoryToParentMapping } from '@/lib/products';

// 상위 카테고리 데이터 삽입
const insertParentCategories = async () => {
  for (const category of parentCategories) {
    const { error } = await supabase
      .from('parent_categories')
      .upsert({
        id: category.id,
        name: category.name,
        description: category.description || null
      });
    
    if (error) {
      console.error('Error inserting parent category:', error);
    }
  }
  console.log('Parent categories inserted successfully');
};

// 카테고리 데이터 삽입
const insertCategories = async () => {
  // 카테고리 목록 생성
  const uniqueCategories = [...new Set(products.map(product => product.category))];
  
  for (const categoryName of uniqueCategories) {
    const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
    const parentId = categoryToParentMapping[categoryName] || null;
    
    const { error } = await supabase
      .from('categories')
      .upsert({
        id: categoryId,
        name: categoryName,
        parent_id: parentId
      });
    
    if (error) {
      console.error('Error inserting category:', error);
    }
  }
  console.log('Categories inserted successfully');
};

// 제품 데이터 삽입
const insertProducts = async () => {
  for (const product of products) {
    // 제품 기본 정보 삽입
    const { data: productData, error: productError } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.toLowerCase().replace(/\s+/g, '-'),
        description: product.description,
        is_featured: product.isFeatured || false,
        in_stock: product.inStock
      })
      .select()
      .single();
    
    if (productError) {
      console.error('Error inserting product:', productError);
      continue;
    }
    
    // 제품 이미지 삽입
    if (product.images.length > 0) {
      const productImages = product.images.map((url, index) => ({
        product_id: product.id,
        url,
        display_order: index
      }));
      
      const { error: imagesError } = await supabase
        .from('product_images')
        .upsert(productImages);
      
      if (imagesError) {
        console.error('Error inserting product images:', imagesError);
      }
    }
    
    // 제품 사이즈 삽입
    if (product.sizes.length > 0) {
      const productSizes = product.sizes.map(size => ({
        product_id: product.id,
        size
      }));
      
      const { error: sizesError } = await supabase
        .from('product_sizes')
        .upsert(productSizes);
      
      if (sizesError) {
        console.error('Error inserting product sizes:', sizesError);
      }
    }
    
    // 제품 색상 삽입
    if (product.colors.length > 0) {
      const productColors = product.colors.map(color => ({
        product_id: product.id,
        color
      }));
      
      const { error: colorsError } = await supabase
        .from('product_colors')
        .upsert(productColors);
      
      if (colorsError) {
        console.error('Error inserting product colors:', colorsError);
      }
    }
  }
  console.log('Products inserted successfully');
};

// 데이터베이스 초기화 함수
export const initSupabaseData = async () => {
  console.log('Initializing Supabase database...');
  
  try {
    // 상위 카테고리 삽입
    await insertParentCategories();
    
    // 카테고리 삽입
    await insertCategories();
    
    // 제품 삽입
    await insertProducts();
    
    console.log('Supabase database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Supabase database:', error);
    return false;
  }
};
