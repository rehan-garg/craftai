import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ImageOff, Sparkles, Trash2, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteSavedProduct, readSavedProducts, persistSavedProducts } from '../../utils/savedProducts';

function SavedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setProducts(readSavedProducts().filter((product) => (product.status || 'draft') === 'draft'));
  }, []);

  const handleDelete = (productId) => {
    const currentProducts = readSavedProducts();
    const nextProducts = deleteSavedProduct(productId, currentProducts);
    persistSavedProducts(nextProducts);
    setProducts(nextProducts.filter((product) => (product.status || 'draft') === 'draft'));
  };

  const formatDate = (value) => {
    if (!value) {
      return 'Saved recently';
    }

    return new Date(value).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const summaryText = useMemo(() => {
    if (products.length === 0) {
      return 'No saved products yet.';
    }

    return `${products.length} saved listing${products.length === 1 ? '' : 's'}`;
  }, [products]);

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-700">Saved Products</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-800">Saved Products</h1>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">
            All your AI-generated artisan listings.
          </p>
        </div>
      </header>

      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-5 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.16)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-800">Your saved listings</h2>
            <p className="mt-1 text-sm text-stone-500">{summaryText}</p>
          </div>
          <Link
            to="/product-studio"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            <Sparkles className="h-4 w-4" />
            Generate New Listing
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <ImageOff className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-stone-800">No saved products yet.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
              Create your first AI-generated artisan listing to keep it saved for later.
            </p>
            <Link
              to="/product-studio"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
            >
              Generate First Listing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {products.map((product) => (
              <article key={product.id} className="rounded-[1.5rem] border border-stone-200/70 bg-stone-50/70 p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  {product.imagePreview ? (
                    <img src={product.imagePreview} alt={product.generatedTitle} className="h-20 w-20 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <Sparkles className="h-6 w-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-stone-800">{product.generatedTitle}</h3>
                    <p className="mt-1 text-sm text-stone-600">{product.estimatedPrice}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-stone-500">Saved {formatDate(product.savedAt)}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/marketplace/${product.id}`)}
                    className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 p-4">
          <div className="w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">Listing Details</p>
                <h3 className="mt-2 text-2xl font-semibold text-stone-800">{selectedProduct.generatedTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="rounded-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                {selectedProduct.imagePreview ? (
                  <img src={selectedProduct.imagePreview} alt={selectedProduct.generatedTitle} className="h-64 w-full rounded-[1.5rem] object-cover" />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-[1.5rem] bg-stone-100 text-stone-500">
                    No image available
                  </div>
                )}
              </div>
              <div className="space-y-4 text-sm text-stone-600">
                <div>
                  <p className="font-semibold text-stone-800">Description</p>
                  <p className="mt-1">{selectedProduct.generatedDescription}</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Price</p>
                  <p className="mt-1">{selectedProduct.estimatedPrice}</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-800">SEO Keywords</p>
                  <p className="mt-1">{selectedProduct.seoKeywords.join(', ')}</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Instagram Caption</p>
                  <p className="mt-1">{selectedProduct.instagramCaption}</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Facebook Caption</p>
                  <p className="mt-1">{selectedProduct.facebookCaption}</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Hashtags</p>
                  <p className="mt-1">{selectedProduct.hashtags.join(' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SavedProducts;
