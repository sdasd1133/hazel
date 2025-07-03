import { supabase } from './supabase';
import {
  Product,
  Category,
  ParentCategory,
  User
} from '@/types/supabase';

// 기존 데이터와 Supabase 데이터 매핑 함수

// Supabase에서 사용자 가져오기
export const getSupabaseUser = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error || !data) return null;
  
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    isAdmin: data.is_admin
  };
};

// Supabase에 사용자 생성
export const createSupabaseUser = async (email: string, name: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .insert({ email, name })
    .select()
    .single();
  
  if (error || !data) return null;
  
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    isAdmin: data.is_admin
  };
};

// Supabase에서 모든 상위 카테고리 가져오기
export const getSupabaseParentCategories = async (): Promise<ParentCategory[]> => {
  const { data, error } = await supabase
    .from('parent_categories')
    .select('*')
    .order('name');
  
  if (error || !data) return [];
  
  return data.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || undefined
  }));
};

// Supabase에서 모든 카테고리 가져오기
export const getSupabaseCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error || !data) return [];
  
  return data.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || undefined,
    parentId: category.parent_id || undefined
  }));
};

// Supabase에서 상위 카테고리별 카테고리 가져오기
export const getSupabaseCategoriesByParent = async (parentId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('name');
  
  if (error || !data) return [];
  
  return data.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || undefined,
    parentId: category.parent_id || undefined
  }));
};

// Supabase에서 모든 제품 가져오기
export const getSupabaseProducts = async (): Promise<Product[]> => {
  // 제품 기본 정보 가져오기
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*');
  
  if (productsError || !productsData) return [];
  
  // 각 제품의 이미지, 사이즈, 컬러 정보 가져오기
  const productsWithDetails = await Promise.all(
    productsData.map(async (product) => {
      // 제품 이미지 가져오기
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('url')
        .eq('product_id', product.id)
        .order('display_order');
      
      // 제품 사이즈 가져오기
      const { data: sizesData } = await supabase
        .from('product_sizes')
        .select('size')
        .eq('product_id', product.id);
      
      // 제품 색상 가져오기
      const { data: colorsData } = await supabase
        .from('product_colors')
        .select('color')
        .eq('product_id', product.id);
      
      // 데이터 매핑
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || '',
        images: imagesData ? imagesData.map(img => img.url) : [],
        sizes: sizesData ? sizesData.map(size => size.size) : [],
        colors: colorsData ? colorsData.map(color => color.color) : [],
        isFeatured: product.is_featured,
        inStock: product.in_stock
      };
    })
  );
  
  return productsWithDetails;
};

// Supabase에서 카테고리별 제품 가져오기
export const getSupabaseProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  // 제품 기본 정보 가져오기
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('category', categoryId);
  
  if (productsError || !productsData) return [];
  
  // 각 제품의 이미지, 사이즈, 컬러 정보 가져오기
  const productsWithDetails = await Promise.all(
    productsData.map(async (product) => {
      // 제품 이미지 가져오기
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('url')
        .eq('product_id', product.id)
        .order('display_order');
      
      // 제품 사이즈 가져오기
      const { data: sizesData } = await supabase
        .from('product_sizes')
        .select('size')
        .eq('product_id', product.id);
      
      // 제품 색상 가져오기
      const { data: colorsData } = await supabase
        .from('product_colors')
        .select('color')
        .eq('product_id', product.id);
      
      // 데이터 매핑
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || '',
        images: imagesData ? imagesData.map(img => img.url) : [],
        sizes: sizesData ? sizesData.map(size => size.size) : [],
        colors: colorsData ? colorsData.map(color => color.color) : [],
        isFeatured: product.is_featured,
        inStock: product.in_stock
      };
    })
  );
  
  return productsWithDetails;
};

// Supabase에서 특정 ID의 제품 가져오기
export const getSupabaseProductById = async (productId: string): Promise<Product | null> => {
  // 제품 기본 정보 가져오기
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
  
  if (productError || !product) return null;
  
  // 제품 이미지 가져오기
  const { data: imagesData } = await supabase
    .from('product_images')
    .select('url')
    .eq('product_id', product.id)
    .order('display_order');
  
  // 제품 사이즈 가져오기
  const { data: sizesData } = await supabase
    .from('product_sizes')
    .select('size')
    .eq('product_id', product.id);
  
  // 제품 색상 가져오기
  const { data: colorsData } = await supabase
    .from('product_colors')
    .select('color')
    .eq('product_id', product.id);
  
  // 데이터 매핑
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    description: product.description || '',
    images: imagesData ? imagesData.map(img => img.url) : [],
    sizes: sizesData ? sizesData.map(size => size.size) : [],
    colors: colorsData ? colorsData.map(color => color.color) : [],
    isFeatured: product.is_featured,
    inStock: product.in_stock
  };
};

// Supabase에서 특징 제품(Featured Products) 가져오기
export const getSupabaseFeaturedProducts = async (): Promise<Product[]> => {
  // 제품 기본 정보 가져오기
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true);
  
  if (productsError || !productsData) return [];
  
  // 각 제품의 이미지, 사이즈, 컬러 정보 가져오기
  const productsWithDetails = await Promise.all(
    productsData.map(async (product) => {
      // 제품 이미지 가져오기
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('url')
        .eq('product_id', product.id)
        .order('display_order');
      
      // 제품 사이즈 가져오기
      const { data: sizesData } = await supabase
        .from('product_sizes')
        .select('size')
        .eq('product_id', product.id);
      
      // 제품 색상 가져오기
      const { data: colorsData } = await supabase
        .from('product_colors')
        .select('color')
        .eq('product_id', product.id);
      
      // 데이터 매핑
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || '',
        images: imagesData ? imagesData.map(img => img.url) : [],
        sizes: sizesData ? sizesData.map(size => size.size) : [],
        colors: colorsData ? colorsData.map(color => color.color) : [],
        isFeatured: product.is_featured,
        inStock: product.in_stock
      };
    })
  );
  
  return productsWithDetails;
};
