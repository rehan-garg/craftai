import { useMemo } from 'react';
import { BarChart3, Compass, Eye, Package, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatIndianCurrency, getProductsByStatus, parseEstimatedPrice, readSavedProducts } from '../../utils/savedProducts';
import { getCurrentUser } from '../../services/authService';

const PIE_COLORS = ['#f59e0b', '#fbbf24'];

function Analytics() {
  const user = getCurrentUser();
  const role = (user?.role || 'Buyer').toLowerCase();
  const products = readSavedProducts();

  const sellerAnalytics = useMemo(() => {
    const draftProducts = getProductsByStatus('draft', products);
    const publishedProducts = getProductsByStatus('published', products);
    const prices = products
      .map((product) => parseEstimatedPrice(product.estimatedPrice))
      .filter((price) => price > 0);

    const categoryCounts = products.reduce((accumulator, product) => {
      const categoryName = product.category?.trim() || 'Uncategorized';
      accumulator[categoryName] = (accumulator[categoryName] || 0) + 1;
      return accumulator;
    }, {});

    const priceDistribution = [
      { name: 'Under ₹2k', value: prices.filter((price) => price < 2000).length },
      { name: '₹2k–₹5k', value: prices.filter((price) => price >= 2000 && price < 5000).length },
      { name: '₹5k–₹10k', value: prices.filter((price) => price >= 5000 && price < 10000).length },
      { name: 'Above ₹10k', value: prices.filter((price) => price >= 10000).length },
    ];

    const publishedToday = products.filter((product) => {
      if ((product.status || 'draft') !== 'published') {
        return false;
      }

      if (!product.savedAt) {
        return false;
      }

      const savedDate = new Date(product.savedAt);
      const today = new Date();
      return savedDate.toDateString() === today.toDateString();
    }).length;

    return {
      aiListingsGenerated: products.length,
      draftProducts: draftProducts.length,
      publishedProducts: publishedProducts.length,
      averagePrice: prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0,
      potentialRevenue: prices.reduce((sum, price) => sum + price, 0),
      publishedToday,
      pieData: [
        { name: 'Draft', value: draftProducts.length },
        { name: 'Published', value: publishedProducts.length },
      ],
      barData: Object.entries(categoryCounts).map(([name, value]) => ({ name, value })),
      lineData: priceDistribution,
      recentActivity: [...products]
        .sort((left, right) => new Date(right.savedAt || 0) - new Date(left.savedAt || 0))
        .slice(0, 4),
    };
  }, [products]);

  const buyerAnalytics = useMemo(() => {
    const storage = typeof window !== 'undefined' ? window.localStorage : null;
    const productsViewed = Number(storage?.getItem('craftai_products_viewed') || 0);
    const marketplaceVisits = Number(storage?.getItem('craftai_marketplace_visits') || 0);
    const savedProducts = products.length;
    const favoriteCategory = storage?.getItem('craftai_favorite_category') || 'No favorite category yet';
    const recentlyViewed = storage?.getItem('craftai_recently_viewed') || '[]';

    return {
      productsViewed,
      marketplaceVisits,
      savedProducts,
      favoriteCategory,
      recentlyViewed: JSON.parse(recentlyViewed),
    };
  }, [products]);

  if (role !== 'seller') {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <section className="rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-600" />
            <h2 className="text-2xl font-semibold tracking-tight text-stone-800">My Activity</h2>
          </div>
          <p className="mt-2 text-sm text-stone-600">A simple view of your recent marketplace behavior and saved discoveries.</p>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-500">Marketplace Visits</p>
              <ShoppingBag className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-stone-800">{buyerAnalytics.marketplaceVisits}</p>
          </article>
          <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-500">Products Viewed</p>
              <Eye className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-stone-800">{buyerAnalytics.productsViewed}</p>
          </article>
          <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-500">Saved Products</p>
              <Package className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-stone-800">{buyerAnalytics.savedProducts}</p>
          </article>
          <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-500">Favorite Category</p>
              <Compass className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-lg font-semibold text-stone-800">{buyerAnalytics.favoriteCategory}</p>
          </article>
        </div>

        <section className="rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-stone-800">Recently Viewed</h3>
          </div>
          {Array.isArray(buyerAnalytics.recentlyViewed) && buyerAnalytics.recentlyViewed.length > 0 ? (
            <div className="mt-4 space-y-3">
              {buyerAnalytics.recentlyViewed.map((item, index) => (
                <div key={`${item.title || 'view'}-${index}`} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="font-medium text-stone-800">{item.title || 'Marketplace item'}</p>
                  <p className="mt-1 text-sm text-stone-600">{item.category || 'Recently discovered product'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-500">
              No recent activity yet. Explore the marketplace to fill this section with personal highlights.
            </p>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <section className="rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          <h2 className="text-2xl font-semibold tracking-tight text-stone-800">Seller Analytics</h2>
        </div>
        <p className="mt-2 text-sm text-stone-600">A clear snapshot of your generated products, their status, and expected value.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-sm text-stone-500">AI Listings Generated</p>
          <p className="mt-3 text-3xl font-semibold text-stone-800">{sellerAnalytics.aiListingsGenerated}</p>
        </article>
        <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-sm text-stone-500">Draft Products</p>
          <p className="mt-3 text-3xl font-semibold text-stone-800">{sellerAnalytics.draftProducts}</p>
        </article>
        <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-sm text-stone-500">Published Products</p>
          <p className="mt-3 text-3xl font-semibold text-stone-800">{sellerAnalytics.publishedProducts}</p>
        </article>
        <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-sm text-stone-500">Average Product Price</p>
          <p className="mt-3 text-3xl font-semibold text-stone-800">{formatIndianCurrency(sellerAnalytics.averagePrice)}</p>
        </article>
        <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-sm text-stone-500">Potential Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-stone-800">{formatIndianCurrency(sellerAnalytics.potentialRevenue)}</p>
        </article>
        <article className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-sm text-stone-500">Products Published Today</p>
          <p className="mt-3 text-3xl font-semibold text-stone-800">{sellerAnalytics.publishedToday}</p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-stone-800">Draft vs Published</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sellerAnalytics.pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                  {sellerAnalytics.pieData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-stone-800">Product Categories</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sellerAnalytics.barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3e8d8" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-stone-800">Product Price Distribution</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sellerAnalytics.lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8d8" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#b45309" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[2rem] border border-stone-200/80 bg-white/80 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] backdrop-blur-xl">
        <h3 className="text-lg font-semibold text-stone-800">Recent Activity</h3>
        <div className="mt-4 space-y-3">
          {sellerAnalytics.recentActivity.length > 0 ? (
            sellerAnalytics.recentActivity.map((product) => (
              <div key={product.id} className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-stone-800">{product.generatedTitle || 'Untitled product'}</p>
                  <p className="text-sm text-stone-600">{product.category || 'Uncategorized'} • {product.status || 'draft'}</p>
                </div>
                <p className="text-sm font-semibold text-amber-700">{formatIndianCurrency(product.estimatedPrice || 0)}</p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-500">
              No activity recorded yet. Save or publish a product to see it here.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Analytics;
