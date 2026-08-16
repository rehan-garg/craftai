const STORAGE_KEY = 'craftai_saved_products';

export function readSavedProducts() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error('Failed to read saved products:', error);
    return [];
  }
}

export function persistSavedProducts(products) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function buildSavedProduct(productData) {
  return {
    id: Date.now(),
    savedAt: new Date().toISOString(),
    status: productData.status || 'draft',
    imagePreview: productData.imagePreview || '',
    originalName: productData.originalName || '',
    category: productData.category || '',
    material: productData.material || '',
    dimensions: productData.dimensions || '',
    story: productData.story || '',
    notes: productData.notes || '',
    generatedTitle: productData.generatedTitle || '',
    generatedDescription: productData.generatedDescription || '',
    estimatedPrice: productData.estimatedPrice || '',
    seoKeywords: productData.seoKeywords || [],
    instagramCaption: productData.instagramCaption || '',
    facebookCaption: productData.facebookCaption || '',
    hashtags: productData.hashtags || [],
  };
}

export function isDuplicateSavedProduct(generatedTitle, existingProducts = readSavedProducts()) {
  const normalizedTitle = generatedTitle?.trim().toLowerCase();

  return existingProducts.some((product) => {
    const savedTitle = product.generatedTitle?.trim().toLowerCase();
    return savedTitle && normalizedTitle && savedTitle === normalizedTitle;
  });
}

export function getSavedProductById(productId, existingProducts = readSavedProducts()) {
  return existingProducts.find((product) => String(product.id) === String(productId)) || null;
}

export function updateSavedProductStatus(productId, status, existingProducts = readSavedProducts()) {
  return existingProducts.map((product) => {
    if (String(product.id) === String(productId)) {
      return {
        ...product,
        status,
      };
    }

    return product;
  });
}

export function deleteSavedProduct(productId, existingProducts = readSavedProducts()) {
  return existingProducts.filter((product) => String(product.id) !== String(productId));
}

export function getProductsByStatus(status, existingProducts = readSavedProducts()) {
  return existingProducts.filter((product) => (product.status || 'draft') === status);
}

export function parseEstimatedPrice(value) {
  if (typeof value !== 'string') {
    return Number(value) || 0;
  }

  const normalizedValue = value.replace(/[₹,\s]/g, '');
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function formatIndianCurrency(value) {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export function getDashboardStats(existingProducts = readSavedProducts()) {
  const normalizedProducts = Array.isArray(existingProducts) ? existingProducts : [];
  const totalProducts = normalizedProducts.length;
  const draftProducts = getProductsByStatus('draft', normalizedProducts).length;
  const publishedProducts = getProductsByStatus('published', normalizedProducts).length;

  const prices = normalizedProducts
    .map((product) => parseEstimatedPrice(product.estimatedPrice))
    .filter((price) => price > 0);

  const averageEstimatedPrice = prices.length > 0
    ? Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
    : 0;

  const categorySummary = normalizedProducts.reduce((accumulator, product) => {
    const categoryName = product.category?.trim() || 'Uncategorized';
    const existingCategory = accumulator.find((entry) => entry.category === categoryName);

    if (existingCategory) {
      existingCategory.count += 1;
      return accumulator;
    }

    accumulator.push({ category: categoryName, count: 1 });
    return accumulator;
  }, []);

  return {
    totalProducts,
    draftProducts,
    publishedProducts,
    averageEstimatedPrice,
    categorySummary: categorySummary.sort((left, right) => right.count - left.count || left.category.localeCompare(right.category)),
    recentPublications: [...normalizedProducts]
      .filter((product) => (product.status || 'draft') === 'published')
      .sort((left, right) => new Date(right.savedAt || 0) - new Date(left.savedAt || 0))
      .slice(0, 3),
  };
}
