import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  Package,
  Save,
  Sparkles,
  CirclePlus,
  ArrowRight,
} from 'lucide-react';
import StatsCard from '../../components/product/StatsCard';
import RecentProductCard from '../../components/product/RecentProductCard';
import { formatIndianCurrency, getDashboardStats, readSavedProducts } from '../../utils/savedProducts';

function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    draftProducts: 0,
    publishedProducts: 0,
    averageEstimatedPrice: 0,
    categorySummary: [],
    recentPublications: [],
  });

  useEffect(() => {
    setDashboardStats(getDashboardStats(readSavedProducts()));
  }, []);

  const stats = useMemo(() => [
    {
      title: 'Products Generated',
      value: dashboardStats.totalProducts.toString(),
      subtitle: dashboardStats.totalProducts === 0 ? 'Start by creating your first listing' : `${dashboardStats.publishedProducts} published`,
      icon: Sparkles,
      accentClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Draft Products',
      value: dashboardStats.draftProducts.toString(),
      subtitle: dashboardStats.draftProducts === 0 ? 'No draft listings yet' : 'Ready for publishing',
      icon: Save,
      accentClass: 'bg-orange-100 text-orange-700',
    },
    {
      title: 'Average Estimated Price',
      value: formatIndianCurrency(dashboardStats.averageEstimatedPrice),
      subtitle: 'AI estimated retail value',
      icon: IndianRupee,
      accentClass: 'bg-rose-100 text-rose-700',
    },
    {
      title: 'Categories',
      value: dashboardStats.categorySummary.length.toString(),
      subtitle: dashboardStats.categorySummary.length === 0 ? 'No categories yet' : 'Across all products',
      icon: Package,
      accentClass: 'bg-stone-100 text-stone-700',
    },
  ], [dashboardStats]);

  const recentListings = useMemo(() => {
    return dashboardStats.recentPublications.map((product) => ({
      title: product.generatedTitle || 'Untitled Listing',
      price: formatIndianCurrency(product.estimatedPrice || 0).replace('₹', ''),
      time: product.savedAt ? new Date(product.savedAt).toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
      }) : 'Recently published',
      imageClass: 'from-amber-200 via-orange-100 to-stone-100',
    }));
  }, [dashboardStats.recentPublications]);

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-700">CraftAI</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-800">Welcome back 👋</h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-600 sm:text-base">
              Manage your AI-generated artisan listings from one place.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm">
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800">Your creative studio is live</p>
              <p className="text-xs text-stone-500">Fresh ideas are ready to publish</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="rounded-[2rem] border border-stone-200/70 bg-white p-5 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.16)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-800">Recent Listings</h2>
            <p className="mt-1 text-sm text-stone-500">Your latest artisan concepts and generated ideas</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
            <CirclePlus className="h-4 w-4" />
            Updated today
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {recentListings.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600 lg:col-span-3">
              No published products yet. Publish your first listing to see it here.
            </div>
          ) : (
            recentListings.map((listing) => (
              <RecentProductCard key={`${listing.title}-${listing.time}`} {...listing} />
            ))
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Link
          to="/product-studio"
          className="group flex items-center justify-between rounded-[2rem] border border-amber-200/70 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white p-3 text-amber-700 shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-800">Generate New Listing</h3>
              <p className="mt-1 text-sm text-stone-600">Create your next artisan product concept</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-stone-600 transition duration-200 group-hover:translate-x-1" />
        </Link>

        <Link
          to="/saved-products"
          className="flex items-center justify-between rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.14)] transition duration-200 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-stone-100 p-3 text-stone-700">
              <Save className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-stone-800">Saved Products</h3>
              <p className="mt-1 text-sm text-stone-600">Temporarily unavailable</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-stone-400" />
        </Link>
      </section>
    </div>
  );
}

export default Dashboard;
