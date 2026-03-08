const stats = [
  { title: "Appointments Today", value: "24", change: "+12%", color: "text-green-500" },
  { title: "Pending Confirmations", value: "7", change: "+4%", color: "text-yellow-500" },
  { title: "Cancelled", value: "3", change: "-2%", color: "text-red-500" },
];

export default function StatsCards() {
  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.title} className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl">
                {stat.value}
              </span>
              <h3 className="text-base font-normal text-gray-500">{stat.title}</h3>
            </div>
            <div
              className={`ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold ${stat.color}`}
            >
              {stat.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}