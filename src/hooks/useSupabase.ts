import { useState, useEffect } from 'react';
import {
  getSupabaseParentCategories,
  getSupabaseCategories,
  getSupabaseCategoriesByParent,
  getSupabaseProducts,
  getSupabaseProductsByCategory,
  getSupabaseProductById,
  getSupabaseFeaturedProducts
} from '@/lib/supabase-utils';
import { Product, Category, ParentCategory } from '@/types/supabase';

// 상위 카테고리 가져오기 훅
export const useParentCategories = () => {
  const [categories, setCategories] = useState<ParentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupabaseParentCategories();
        setCategories(data);
      } catch (err) {
        setError('카테고리를 불러오는 중 오류가 발생했습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, loading, error };
};

// 카테고리 가져오기 훅
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupabaseCategories();
        setCategories(data);
      } catch (err) {
        setError('카테고리를 불러오는 중 오류가 발생했습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, loading, error };
};

// 상위 카테고리별 하위 카테고리 가져오기 훅
export const useCategoriesByParent = (parentId: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupabaseCategoriesByParent(parentId);
        setCategories(data);
      } catch (err) {
        setError('카테고리를 불러오는 중 오류가 발생했습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parentId]);

  return { categories, loading, error };
};

// 제품 목록 가져오기 훅
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupabaseProducts();
        setProducts(data);
      } catch (err) {
        setError('제품을 불러오는 중 오류가 발생했습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};

// 카테고리별 제품 가져오기 훅
export const useProductsByCategory = (categoryId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupabaseProductsByCategory(categoryId);
        setProducts(data);
      } catch (err) {
        setError('제품을 불러오는 중 오류가 발생했습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  return { products, loading, error };
};

// 특정 제품 가져오기 훅
export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupabaseProductById(productId);
        setProduct(data);
      } catch (err) {
        setError('제품을 불러오는 중 오류가 발생했습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return { product, loading, error };
};

// 특징 제품(Featured Products) 가져오기 훅
export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSupabaseFeaturedProducts();
        setProducts(data);
      } catch (err) {
        setError('추천 제품을 불러오는 중 오류가 발생했습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};
