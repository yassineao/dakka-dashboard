const navItems = ["Dashboard", "Appointments", "Patients", "Calendar", "Settings"];

export default function Sidebar() {
  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 z-20 hidden h-full w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white pt-16 lg:flex"
      aria-label="Sidebar"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="space-y-1 px-3">
          {navItems.map((item, index) => (
            <a
              key={item}
              href="#"
              className={`group flex items-center rounded-lg p-2 text-base font-normal ${
                index === 1
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="ml-3">{item}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}