'use client'

import { useState, useEffect } from 'react'
import { productClient, type Product, type CreateProductData } from '@/lib/services/products'

interface Category {
  id: number
  name: string
  slug: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    price: 0,
    sale_price: 0,
    stock_quantity: 0,
    category_id: 0,
    sku: '',
    images: [],
    tags: [],
    status: 'draft',
    featured: false
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Loading data...')
      
      const [productsData, categoriesData] = await Promise.all([
        productClient.getProducts(),
        loadCategories()
      ])
      
      console.log('Data loaded successfully:', {
        products: productsData?.length || 0,
        categories: categoriesData?.length || 0
      })
      
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('데이터 로드 오류:', error)
      
      // 에러 메시지를 더 구체적으로 표시
      let errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.'
      
      if (error instanceof Error) {
        errorMessage = `데이터 로드 실패: ${error.message}`
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      // 먼저 DB에서 카테고리를 가져와보고, 없으면 기본 카테고리 사용
      const response = await fetch('/api/categories');
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        return result.data.map((category: any) => ({
          id: category.id,
          name: category.name,
          slug: category.slug
        }));
      }
      
      // DB에 카테고리가 없으면 기본 카테고리 사용
      console.log('DB에 카테고리가 없어서 기본 카테고리를 사용합니다.');
      const categories = [
        { id: 'women-clothing', name: '여성의류' },
        { id: 'men-clothing', name: '남성의류' },
        { id: 'bags', name: '가방' },
        { id: 'shoes', name: '신발' },
        { id: 'accessories', name: '악세서리' },
        { id: 'watches', name: '시계' },
        { id: 'hats', name: '모자' },
        { id: 'belts', name: '벨트' },
        { id: 'sports-clothing', name: '스포츠의류' },
        { id: 'coordinated-sets', name: '코디세트' },
        { id: 'used-luxury', name: '중고명품' }
      ];
      
      // Category 인터페이스에 맞게 변환
      return categories.map((category, index) => ({
        id: index + 1, // 임시 ID (1부터 시작)
        name: category.name,
        slug: category.id
      }));
    } catch (error) {
      console.error('카테고리 로드 오류:', error);
      
      // 오류 발생 시에도 기본 카테고리 반환
      const categories = [
        { id: 'women-clothing', name: '여성의류' },
        { id: 'men-clothing', name: '남성의류' },
        { id: 'bags', name: '가방' },
        { id: 'shoes', name: '신발' },
        { id: 'accessories', name: '악세서리' },
        { id: 'watches', name: '시계' },
        { id: 'hats', name: '모자' },
        { id: 'belts', name: '벨트' },
        { id: 'sports-clothing', name: '스포츠의류' },
        { id: 'coordinated-sets', name: '코디세트' },
        { id: 'used-luxury', name: '중고명품' }
      ];
      
      return categories.map((category, index) => ({
        id: index + 1,
        name: category.name,
        slug: category.id
      }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 폼 유효성 검사
    if (!formData.name.trim()) {
      alert('상품명을 입력해주세요.')
      return
    }
    
    if (formData.price <= 0) {
      alert('올바른 가격을 입력해주세요.')
      return
    }
    
    // 카테고리는 선택사항으로 변경 (DB 스키마에서 nullable이므로)
    // if (!formData.category_id || formData.category_id === 0) {
    //   alert('카테고리를 선택해주세요.')
    //   return
    // }
    
    try {
      console.log('Submitting form data:', formData);
      
      // 이미지 URL 배열 생성 (실제 환경에서는 서버에 업로드 후 URL 받아옴)
      const imageUrls: string[] = []
      
      // 임시로 미리보기 URL을 사용 (실제로는 서버 업로드 필요)
      if (imageFiles.length > 0) {
        // 여기서 실제 이미지 업로드 API를 호출해야 함
        console.log('업로드할 이미지 파일들:', imageFiles)
        
        // 임시로 placeholder 이미지 URL 사용
        for (let i = 0; i < imageFiles.length; i++) {
          imageUrls.push(`/placeholder-product-${i + 1}.jpg`)
        }
      }
      
      const productData = {
        ...formData,
        category_id: formData.category_id === 0 ? null : formData.category_id,
        images: imageUrls.length > 0 ? imageUrls : formData.images
      }
      
      console.log('Final product data to submit:', productData);
      
      if (editingProduct) {
        const result = await productClient.updateProduct({
          ...productData,
          id: editingProduct.id
        })
        console.log('Product updated:', result);
        alert('상품이 수정되었습니다.')
      } else {
        const result = await productClient.createProduct(productData)
        console.log('Product created:', result);
        alert('상품이 등록되었습니다.')
      }
      
      resetForm()
      loadData()
    } catch (error) {
      console.error('상품 저장 오류:', error)
      
      // 에러 메시지를 더 구체적으로 표시
      let errorMessage = '상품 저장 중 오류가 발생했습니다.'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      alert(errorMessage)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      sale_price: product.sale_price || 0,
      stock_quantity: product.stock_quantity,
      category_id: product.category_id || 0,
      sku: product.sku || '',
      images: product.images || [],
      tags: product.tags || [],
      status: product.status,
      featured: product.featured
    })
    
    // 기존 이미지가 있으면 미리보기로 설정
    if (product.images && product.images.length > 0) {
      setImagePreviewUrls([...product.images])
      setImageFiles([]) // 기존 이미지는 파일이 아니므로 빈 배열
    } else {
      setImagePreviewUrls([])
      setImageFiles([])
    }
    
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 상품을 삭제하시겠습니까?')) return

    try {
      await productClient.deleteProduct(id)
      alert('상품이 삭제되었습니다.')
      loadData()
    } catch (error) {
      console.error('상품 삭제 오류:', error)
      alert('상품 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked 
              : type === 'number' ? parseFloat(value) || 0 
              : value
    }))
  }

  // 이미지 파일 선택 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // 총 이미지 개수 제한 (현재 + 새로 선택한 것)
    if (imageFiles.length + files.length > 10) {
      alert('최대 10장까지만 업로드할 수 있습니다.')
      return
    }
    
    // 파일 유효성 검사
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB 제한
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      
      if (!isImage || !isValidType) {
        alert(`${file.name}은(는) 지원하지 않는 이미지 형식입니다. (JPG, PNG, WebP만 지원)`)
        return false
      }
      if (!isValidSize) {
        alert(`${file.name}은(는) 5MB를 초과합니다.`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles])
      
      // 미리보기 URL 생성
      validFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviewUrls(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
    
    // input 값 초기화 (같은 파일 재선택 가능하게)
    e.target.value = ''
  }

  // 이미지 삭제 핸들러
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  // 이미지 순서 변경 핸들러
  const moveImage = (fromIndex: number, toIndex: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev]
      const [movedFile] = newFiles.splice(fromIndex, 1)
      newFiles.splice(toIndex, 0, movedFile)
      return newFiles
    })
    
    setImagePreviewUrls(prev => {
      const newUrls = [...prev]
      const [movedUrl] = newUrls.splice(fromIndex, 1)
      newUrls.splice(toIndex, 0, movedUrl)
      return newUrls
    })
  }

  // 폼 리셋 시 이미지도 초기화
  const resetForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setImageFiles([])
    setImagePreviewUrls([])
    setFormData({
      name: '',
      description: '',
      price: 0,
      sale_price: 0,
      stock_quantity: 0,
      category_id: 0,
      sku: '',
      images: [],
      tags: [],
      status: 'draft',
      featured: false
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          상품 등록
        </button>
      </div>

      {/* 상품 등록/수정 폼 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? '상품 수정' : '상품 등록'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">상품명</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">카테고리</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value={0}>카테고리 선택</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">정가</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">판매가</label>
                  <input
                    type="number"
                    name="sale_price"
                    value={formData.sale_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">재고 수량</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">상태</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="draft">임시저장</option>
                  <option value="active">판매중</option>
                  <option value="inactive">판매중지</option>
                  <option value="out_of_stock">품절</option>
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  추천 상품으로 설정
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">상품 설명</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* 이미지 업로드 섹션 */}
              <div>
                <label className="block text-sm font-medium mb-2">상품 이미지</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`상품 이미지 ${index + 1}`} 
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200" 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="이미지 삭제"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index - 1)}
                              className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors ml-1"
                              title="왼쪽으로 이동"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                              </svg>
                            </button>
                          )}
                          {index < imagePreviewUrls.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index + 1)}
                              className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors ml-1"
                              title="오른쪽으로 이동"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </button>
                          )}
                        </div>
                        {index === 0 && (
                          <span className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            대표
                          </span>
                        )}
                      </div>
                    ))}
                    
                    {/* 이미지 추가 버튼 */}
                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                      <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      <span className="text-xs text-gray-500">이미지 추가</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>• 최대 10장까지 업로드 가능</p>
                    <p>• 권장 크기: 800x800px 이상</p>
                    <p>• 지원 형식: JPG, PNG, WebP</p>
                    <p>• 최대 파일 크기: 5MB</p>
                    <p>• 첫 번째 이미지가 대표 이미지로 사용됩니다</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingProduct ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상품 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상품명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  재고
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    {product.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        추천
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(product as any).categories?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sale_price && product.sale_price !== product.price ? (
                      <div>
                        <span className="line-through text-gray-500">
                          ₩{product.price.toLocaleString()}
                        </span>
                        <br />
                        <span className="text-red-600 font-semibold">
                          ₩{product.sale_price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span>₩{product.price.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock_quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' :
                      product.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      product.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status === 'active' ? '판매중' :
                       product.status === 'draft' ? '임시저장' :
                       product.status === 'inactive' ? '판매중지' : '품절'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">등록된 상품이 없습니다.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            첫 상품 등록하기
          </button>
        </div>
      )}
    </div>
  )
}
