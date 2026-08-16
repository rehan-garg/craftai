function StatsCard({ icon: Icon, title, value, subtitle, accentClass = 'bg-amber-100 text-amber-700' }) {
  return (
    <div className="group rounded-[1.75rem] border border-stone-200/70 bg-white p-5 shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-800">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-stone-600">{subtitle}</p>
    </div>
  );
}

export default StatsCard;
