'use client'

import { useState, useEffect } from 'react'
import { productClient, type Product, type CreateProductData } from '@/lib/services/products'
import { getCategories, getParentCategories, getCategoriesByParent } from '@/lib/products'

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
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
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

  // 카테고리 ID로 카테고리명 찾기 함수
  const getCategoryNameById = (categoryId: number | null) => {
    if (!categoryId) return '-'
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : '-'
  }

  // 사이즈 및 색상 옵션
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE']
  const availableColors = ['Black', 'White', 'Gray', 'Navy', 'Brown', 'Beige', 'Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Purple']

  // 사이즈 선택이 필요 없는 카테고리 확인
  const shouldShowSizeSelection = () => {
    const selectedCategory = categories.find(cat => cat.id === formData.category_id)
    if (!selectedCategory) return true
    
    const noSizeCategories = ['가방', '시계', '악세사리']
    return !noSizeCategories.some(cat => 
      selectedCategory.name.toLowerCase().includes(cat.toLowerCase())
    )
  }

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
      
      // DB에 카테고리가 없으면 메인 사이트와 동일한 순서로 카테고리 사용
      console.log('DB에 카테고리가 없어서 메인 사이트와 동일한 카테고리를 사용합니다.');
      
      // 메인 사이트와 완전히 동일한 순서 (src/lib/products.ts의 순서)
      const mainSiteCategories = [
        "남성의류",
        "여성의류", 
        "스포츠의류",
        "악세사리",
        "모자",
        "가방",
        "신발",
        "시계",
        "벨트",
        "깔맞춤",
        "중고명품"
      ];
      
      // Category 인터페이스에 맞게 변환
      return mainSiteCategories.map((name, index) => ({
        id: index + 1, // 1부터 시작하는 ID
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      }));
    } catch (error) {
      console.error('카테고리 로드 오류:', error);
      
      // 오류 발생 시에도 메인 사이트와 동일한 순서로 카테고리 반환
      const mainSiteCategories = [
        "남성의류",
        "여성의류", 
        "스포츠의류",
        "악세사리",
        "모자",
        "가방",
        "신발",
        "시계",
        "벨트",
        "깔맞춤",
        "중고명품"
      ];
      
      return mainSiteCategories.map((name, index) => ({
        id: index + 1,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-')
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
      console.log('Selected category_id:', formData.category_id);
      console.log('Available categories:', categories);
      
      // 선택된 카테고리 정보 찾기
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);
      console.log('Selected category info:', selectedCategory);
      
      // SKU 자동 생성 (비어있거나 중복일 경우)
      let finalSku = formData.sku;
      if (!finalSku || finalSku.trim() === '') {
        // 상품명과 타임스탬프를 이용한 고유 SKU 생성
        const timestamp = Date.now();
        const productNameSlug = formData.name.replace(/[^a-zA-Z0-9가-힣]/g, '').substring(0, 10);
        finalSku = `SKU-${productNameSlug}-${timestamp}`;
      }
      
      const productData = {
        ...formData,
        sku: finalSku,
        category_id: formData.category_id === 0 ? null : formData.category_id,
        images: imageUrls.length > 0 ? imageUrls : formData.images,
        // 사이즈와 색상 정보를 tags 배열에 추가
        tags: [
          ...formData.tags,
          ...selectedSizes.map(size => `size:${size}`),
          ...selectedColors.map(color => `color:${color}`)
        ]
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
    
    // 기존 이미지 URL이 있으면 설정
    if (product.images && product.images.length > 0) {
      setImageUrls([...product.images])
    } else {
      setImageUrls([])
    }
    
    // 기존 사이즈와 색상 정보 로드
    if (product.tags && product.tags.length > 0) {
      const sizes = product.tags.filter(tag => tag.startsWith('size:')).map(tag => tag.replace('size:', ''))
      const colors = product.tags.filter(tag => tag.startsWith('color:')).map(tag => tag.replace('color:', ''))
      setSelectedSizes(sizes)
      setSelectedColors(colors)
    } else {
      setSelectedSizes([])
      setSelectedColors([])
    }
    
    // 편집 시에는 파일 배열 초기화 (기존 이미지는 URL로 처리)
    setImageFiles([])
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

  // 이미지 파일 업로드 핸들러
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    // 최대 10장 제한 확인
    if (imageUrls.length + files.length > 10) {
      alert(`최대 10장까지만 등록할 수 있습니다. 현재 ${imageUrls.length}장이 등록되어 있어 ${10 - imageUrls.length}장만 추가할 수 있습니다.`)
      return
    }
    
    setUploadingImages(true)
    
    try {
      const newImageUrls: string[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // 파일 타입 검사
        if (!file.type.startsWith('image/')) {
          alert(`${file.name}은(는) 이미지 파일이 아닙니다.`)
          continue
        }
        
        // 파일 크기 검사 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name}은(는) 파일 크기가 5MB를 초과합니다.`)
          continue
        }
        
        // 파일을 Base64로 변환하여 미리보기용으로 사용
        const reader = new FileReader()
        reader.onload = () => {
          if (reader.result) {
            newImageUrls.push(reader.result as string)
            
            // 모든 파일이 처리되었을 때
            if (newImageUrls.length === files.length) {
              setImageUrls(prev => [...prev, ...newImageUrls])
              setImageFiles(prev => [...prev, ...Array.from(files)])
            }
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploadingImages(false)
    }
  }

  // 이미지 URL 삭제 핸들러 (파일도 함께 삭제)
  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
    setImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  // 이미지 순서 변경 핸들러
  const moveImageUrl = (fromIndex: number, toIndex: number) => {
    setImageUrls(prev => {
      const newUrls = [...prev]
      const [movedUrl] = newUrls.splice(fromIndex, 1)
      newUrls.splice(toIndex, 0, movedUrl)
      return newUrls
    })
    setImageFiles(prev => {
      const newFiles = [...prev]
      const [movedFile] = newFiles.splice(fromIndex, 1)
      newFiles.splice(toIndex, 0, movedFile)
      return newFiles
    })
  }

  // 사이즈 선택 토글 핸들러
  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  // 색상 선택 토글 핸들러
  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  // 폼 리셋 시 이미지도 초기화
  const resetForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setImageUrls([])
    setImageFiles([])
    setSelectedSizes([])
    setSelectedColors([])
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
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0} className="text-gray-500">카테고리 선택</option>
                  {/* 의류 카테고리 그룹 */}
                  <optgroup label="👔 의류">
                    {categories.filter(cat => ['남성의류', '여성의류', '스포츠의류'].includes(cat.name)).map(category => (
                      <option key={category.id} value={category.id} className="pl-4">
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                  {/* 아이템 카테고리 그룹 */}
                  <optgroup label="👜 아이템">
                    {categories.filter(cat => ['악세사리', '모자', '가방', '신발', '시계', '벨트'].includes(cat.name)).map(category => (
                      <option key={category.id} value={category.id} className="pl-4">
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                  {/* 추천 카테고리 그룹 */}
                  <optgroup label="⭐ 추천">
                    {categories.filter(cat => ['깔맞춤', '중고명품'].includes(cat.name)).map(category => (
                      <option key={category.id} value={category.id} className="pl-4">
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  메인 사이트와 동일한 카테고리 구조 및 순서로 표시됩니다.
                  {formData.category_id !== 0 && (
                    <span className="block mt-1 text-blue-600 font-medium">
                      선택됨: {getCategoryNameById(formData.category_id)}
                    </span>
                  )}
                </div>
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
                  <label className="block text-sm font-medium mb-1">SKU (자동 생성)</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="비워두면 자동으로 생성됩니다"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    비워두면 상품 등록 시 자동으로 고유한 SKU가 생성됩니다.
                  </div>
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

              {/* 이미지 파일 업로드 섹션 */}
              <div>
                <label className="block text-sm font-medium mb-2">상품 이미지</label>
                
                {/* 파일 업로드 */}
                <div className="mb-4">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WebP (최대 5MB)</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                        disabled={uploadingImages || imageUrls.length >= 10}
                      />
                    </label>
                  </div>
                  
                  {uploadingImages && (
                    <div className="flex items-center justify-center mt-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-sm text-gray-600">이미지 업로드 중...</span>
                    </div>
                  )}
                </div>
                
                {/* 이미지 미리보기 */}
                {imageUrls.length > 0 && (
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="flex flex-wrap gap-3 mb-2">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={url} 
                            alt={`상품 이미지 ${index + 1}`} 
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200" 
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.jpg'
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImageUrl(index)}
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
                                onClick={() => moveImageUrl(index, index - 1)}
                                className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors ml-1"
                                title="왼쪽으로 이동"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                              </button>
                            )}
                            {index < imageUrls.length - 1 && (
                              <button
                                type="button"
                                onClick={() => moveImageUrl(index, index + 1)}
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
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-500 mt-2">
                  <p>• 최대 10장까지 등록 가능</p>
                  <p>• 파일 크기는 5MB 이하로 제한됩니다</p>
                  <p>• 권장 크기: 800x800px 이상</p>
                  <p>• 지원 형식: JPG, PNG, WebP</p>
                  <p>• 첫 번째 이미지가 대표 이미지로 사용됩니다</p>
                  <p>• 드래그로 이미지 순서를 변경할 수 있습니다</p>
                </div>
              </div>

              {/* 사이즈 선택 섹션 (특정 카테고리만) */}
              {shouldShowSizeSelection() && (
                <div>
                  <label className="block text-sm font-medium mb-2">사이즈 선택</label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                            selectedSizes.includes(size)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {selectedSizes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          선택된 사이즈: {selectedSizes.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    복수 선택 가능합니다. 가방, 시계, 악세사리 카테고리는 사이즈 선택이 표시되지 않습니다.
                  </div>
                </div>
              )}

              {/* 색상 선택 섹션 */}
              <div>
                <label className="block text-sm font-medium mb-2">색상 선택</label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                          selectedColors.includes(color)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                  {selectedColors.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        선택된 색상: {selectedColors.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  복수 선택 가능합니다. 모든 카테고리에서 색상을 선택할 수 있습니다.
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCategoryNameById(product.category_id)}
                    </span>
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
