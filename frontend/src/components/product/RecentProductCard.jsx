function RecentProductCard({ title, price, time, imageClass }) {
  return (
    <div className="flex items-center gap-4 rounded-[1.5rem] border border-stone-200/70 bg-stone-50/80 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${imageClass}`}>
        <span className="text-lg font-semibold text-stone-700">AI</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-base font-semibold text-stone-800">{title}</h3>
          <span className="text-sm font-semibold text-stone-700">₹{price}</span>
        </div>
        <p className="mt-1 text-sm text-stone-500">{time}</p>
      </div>
    </div>
  );
}

export default RecentProductCard;
