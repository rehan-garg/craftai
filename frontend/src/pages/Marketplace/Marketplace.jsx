import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
  WandSparkles,
} from 'lucide-react';
import { deleteSavedProduct, getProductsByStatus, getSavedProductById, persistSavedProducts, readSavedProducts, updateSavedProductStatus } from '../../utils/savedProducts';

function Marketplace() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [publishedProducts, setPublishedProducts] = useState([]);
  const [copiedField, setCopiedField] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState(location.state?.toastMessage || '');

  useEffect(() => {
    const savedProducts = readSavedProducts();
    const selectedProduct = getSavedProductById(id, savedProducts);
    setProduct(selectedProduct);
    setPublishedProducts(getProductsByStatus('published', savedProducts));
  }, [id]);

  useEffect(() => {
    if (!location.state?.toastMessage) {
      return;
    }

    setToastMessage(location.state.toastMessage);
    const timerId = window.setTimeout(() => setToastMessage(''), 2500);

    return () => window.clearTimeout(timerId);
  }, [location.state?.toastMessage]);

  const highlights = useMemo(() => {
    if (!product) {
      return [];
    }

    return [
      product.material || 'Handmade',
      product.category || 'Artisan',
      product.story?.includes('traditional') || product.story?.includes('heritage') ? 'Traditional Craft' : 'Crafted with Care',
      product.category === 'Home Decor' ? 'Home Decor' : 'Artisan Made',
    ].filter(Boolean);
  }, [product]);

  const handleCopy = async (value, field) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(''), 1500);
    } catch (error) {
      console.error('Copy failed', error);
    }
  };

  const handlePublishProduct = () => {
    if (!product) {
      return;
    }

    const nextProducts = updateSavedProductStatus(product.id, 'published', readSavedProducts());
    persistSavedProducts(nextProducts);
    navigate('/marketplace', { state: { toastMessage: 'Product published successfully.' } });
  };

  const handleDeleteListing = () => {
    if (!product) {
      return;
    }

    const nextProducts = deleteSavedProduct(product.id, readSavedProducts());
    persistSavedProducts(nextProducts);
    setShowDeleteConfirm(false);
    navigate('/marketplace', { state: { toastMessage: 'Listing deleted successfully.' } });
  };

  if (!id) {
    return (
      <div className="space-y-6">
        <header className="rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] sm:p-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-700">Marketplace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-800">Marketplace</h1>
            <p className="mt-2 text-sm text-stone-600 sm:text-base">
              Browse your published artisan listings.
            </p>
          </div>
        </header>

        <section className="rounded-[2rem] border border-stone-200/70 bg-white p-5 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.16)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-stone-800">Published products</h2>
              <p className="mt-1 text-sm text-stone-500">Your marketplace-ready listings</p>
            </div>
            <Link
              to="/product-studio"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              <WandSparkles className="h-4 w-4" />
              Generate New Listing
            </Link>
          </div>

          {publishedProducts.length === 0 ? (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-stone-800">No published products yet.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
                Publish your first listing from the product studio and it will appear here.
              </p>
              <Link
                to="/product-studio"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
              >
                Generate New Listing
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {publishedProducts.map((item) => (
                <article key={item.id} className="rounded-[1.5rem] border border-stone-200/70 bg-stone-50/70 p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    {item.imagePreview ? (
                      <img src={item.imagePreview} alt={item.generatedTitle} className="h-20 w-20 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                        <Sparkles className="h-6 w-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-stone-800">{item.generatedTitle}</h3>
                      <p className="mt-1 text-sm text-stone-600">{item.estimatedPrice}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-stone-500">{item.category}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/marketplace/${item.id}`)}
                      className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-stone-200/70 bg-white p-8 text-center shadow-[0_20px_45px_-20px_rgba(120,53,15,0.16)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-stone-800">Product not found</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-stone-600">
            The listing you are looking for is no longer available in your saved collection.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/saved-products')}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Saved Products
            </button>
            <Link
              to="/product-studio"
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
            >
              <WandSparkles className="h-4 w-4" />
              Generate Another Listing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-stone-200/70 bg-white p-5 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.16)] sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-stone-200/70 bg-stone-50 p-3">
            {product.imagePreview ? (
              <img src={product.imagePreview} alt={product.generatedTitle} className="h-[28rem] w-full rounded-[1.5rem] object-cover" />
            ) : (
              <div className="flex h-[28rem] items-center justify-center rounded-[1.5rem] bg-amber-100 text-amber-700">
                <Sparkles className="h-10 w-10" />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-700">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-800">{product.generatedTitle}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">
                  {product.estimatedPrice}
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700">
                  {product.category}
                </span>
                <span className="rounded-full bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-700">
                  {product.material}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Buy Now
                </button>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Heart className="h-4 w-4" />
                  Add to Wishlist
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {(product.status || 'draft') === 'published' ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-500 transition disabled:cursor-not-allowed"
                  >
                    Already Published
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublishProduct}
                    className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
                  >
                    Publish to Marketplace
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Delete Listing
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-stone-200/70 bg-stone-50/70 p-5">
              <h2 className="text-lg font-semibold text-stone-800">Description</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{product.generatedDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[2rem] border border-stone-200/70 bg-white p-5 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.16)] sm:p-6">
          <h2 className="text-xl font-semibold text-stone-800">Product Highlights</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <span key={highlight} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-stone-800">SEO Keywords</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(product.seoKeywords || []).map((keyword) => (
                <span key={keyword} className="rounded-full bg-stone-100 px-3 py-2 text-sm font-medium text-stone-700">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-200/70 bg-white p-5 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.16)] sm:p-6">
          <h2 className="text-xl font-semibold text-stone-800">Social Media</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-[1.25rem] border border-stone-200/70 bg-stone-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-stone-800">Instagram Caption</h3>
                <button type="button" onClick={() => handleCopy(product.instagramCaption, 'instagram')} className="rounded-full border border-stone-300 bg-white p-2 text-stone-600 transition hover:border-amber-500 hover:text-amber-700">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-600">{product.instagramCaption}</p>
              {copiedField === 'instagram' ? <p className="mt-2 text-xs font-medium text-emerald-700">Copied</p> : null}
            </div>

            <div className="rounded-[1.25rem] border border-stone-200/70 bg-stone-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-stone-800">Facebook Caption</h3>
                <button type="button" onClick={() => handleCopy(product.facebookCaption, 'facebook')} className="rounded-full border border-stone-300 bg-white p-2 text-stone-600 transition hover:border-amber-500 hover:text-amber-700">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-600">{product.facebookCaption}</p>
              {copiedField === 'facebook' ? <p className="mt-2 text-xs font-medium text-emerald-700">Copied</p> : null}
            </div>

            <div className="rounded-[1.25rem] border border-stone-200/70 bg-stone-50/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-stone-800">Suggested Hashtags</h3>
                <button type="button" onClick={() => handleCopy((product.hashtags || []).join(' '), 'hashtags')} className="rounded-full border border-stone-300 bg-white p-2 text-stone-600 transition hover:border-amber-500 hover:text-amber-700">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-7 text-stone-600">{(product.hashtags || []).join(' ')}</p>
              {copiedField === 'hashtags' ? <p className="mt-2 text-xs font-medium text-emerald-700">Copied</p> : null}
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => navigate('/saved-products')}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Saved Products
        </button>
        <Link
          to="/product-studio"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          <WandSparkles className="h-4 w-4" />
          Generate Another Listing
        </Link>
      </div>

      {toastMessage ? (
        <div className="fixed bottom-4 right-4 z-[70] rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-lg">
          {toastMessage}
        </div>
      ) : null}

      {showDeleteConfirm ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/55 p-4">
          <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-stone-800">Delete this listing?</h3>
            <p className="mt-2 text-sm text-stone-600">This action cannot be undone.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-2xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteListing}
                className="rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Marketplace;
