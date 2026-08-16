import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, CalendarDays, Compass, Eye, LogOut, Package, ShoppingBag, Sparkles, UserRound } from 'lucide-react';
import { getCurrentUser, logout } from '../../services/authService';
import { formatIndianCurrency, getProductsByStatus, readSavedProducts } from '../../utils/savedProducts';

function Profile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const products = readSavedProducts();
  const role = (user?.role || 'Buyer').toLowerCase();

  const sellerStats = useMemo(() => {
    const draftProducts = getProductsByStatus('draft', products).length;
    const publishedProducts = getProductsByStatus('published', products).length;
    const prices = products
      .map((product) => Number(String(product.estimatedPrice || '').replace(/[^0-9.-]/g, '')) || 0)
      .filter((price) => price > 0);

    return {
      aiListingsGenerated: products.length,
      draftProducts,
      publishedProducts,
      marketplaceProducts: publishedProducts,
      averagePrice: prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0,
    };
  }, [products]);

  const buyerStats = useMemo(() => {
    const storage = typeof window !== 'undefined' ? window.localStorage : null;
    const productsViewed = Number(storage?.getItem('craftai_products_viewed') || 0);
    const marketplaceVisits = Number(storage?.getItem('craftai_marketplace_visits') || 0);
    const favoriteCategory = storage?.getItem('craftai_favorite_category') || null;
    const inferredFavoriteCategory = favoriteCategory || products.reduce((currentFavorite, product) => {
      if (!product.category) {
        return currentFavorite;
      }

      return currentFavorite || product.category;
    }, 'No category yet');

    return {
      productsViewed,
      savedProducts: products.length,
      marketplaceVisits,
      favoriteCategory: inferredFavoriteCategory,
    };
  }, [products]);

  const avatarLetter = (user?.name || 'U').trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const stats = role === 'seller' ? sellerStats : buyerStats;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <section className="rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl font-semibold text-amber-700">
              {avatarLetter}
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-stone-800">{user?.name || 'Guest User'}</p>
              <p className="mt-1 text-sm text-stone-600">{user?.email || 'No email available'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${role === 'seller' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {role === 'seller' ? 'Seller' : 'Buyer'}
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                  Member since {user?.memberSince || 'Recently joined'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-stone-800">Quick Stats</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {role === 'seller' ? (
            <>
              <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">AI Listings Generated</p>
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-stone-800">{sellerStats.aiListingsGenerated}</p>
              </article>
              <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">Draft Products</p>
                  <Bookmark className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-stone-800">{sellerStats.draftProducts}</p>
              </article>
              <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">Published Products</p>
                  <ShoppingBag className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-stone-800">{sellerStats.publishedProducts}</p>
              </article>
              <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">Marketplace Products</p>
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-stone-800">{sellerStats.marketplaceProducts}</p>
              </article>
            </>
          ) : (
            <>
              <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">Products Viewed</p>
                  <Eye className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-stone-800">{buyerStats.productsViewed}</p>
              </article>
              <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">Saved Products</p>
                  <Bookmark className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-stone-800">{buyerStats.savedProducts}</p>
              </article>
              <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">Marketplace Visits</p>
                  <ShoppingBag className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-stone-800">{buyerStats.marketplaceVisits}</p>
              </article>
              <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">Favorite Category</p>
                  <Compass className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-3 text-lg font-semibold text-stone-800">{buyerStats.favoriteCategory}</p>
              </article>
            </>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-stone-800">Profile Notes</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {role === 'seller'
            ? 'Your workspace is ready for new product ideas, draft saves, and marketplace publishing updates.'
            : 'Your browsing activity appears here so you can revisit recent discoveries and favorite categories quickly.'}
        </p>
      </section>
    </div>
  );
}

export default Profile;
