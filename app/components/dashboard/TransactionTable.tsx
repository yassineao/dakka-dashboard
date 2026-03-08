const appointments = [
  {
    patient: "Bonnie Green",
    date: "2026-03-08",
    time: "09:00",
    status: "Confirmed",
  },
  {
    patient: "Lana Byrd",
    date: "2026-03-08",
    time: "10:30",
    status: "Pending",
  },
  {
    patient: "Jese Leos",
    date: "2026-03-08",
    time: "11:15",
    status: "Completed",
  },
  {
    patient: "Michael Gough",
    date: "2026-03-08",
    time: "13:00",
    status: "Confirmed",
  },
  {
    patient: "Neil Sims",
    date: "2026-03-08",
    time: "15:45",
    status: "Cancelled",
  },
];

export default function TransactionsTable() {
  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Appointments</h3>
          <span className="text-base font-normal text-gray-500">
            Manage and review all appointments
          </span>
        </div>
        <div className="flex-shrink-0">
          <a
            href="#"
            className="rounded-lg p-2 text-sm font-medium text-cyan-600 hover:bg-gray-100"
          >
            View all
          </a>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Patient
              </th>
              <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Time
              </th>
              <th className="p-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {appointments.map((appointment, index) => (
              <tr key={index} className={index % 2 ? "bg-gray-50" : ""}>
                <td className="whitespace-nowrap p-4 text-sm font-medium text-gray-900">
                  {appointment.patient}
                </td>
                <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                  {appointment.date}
                </td>
                <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                  {appointment.time}
                </td>
                <td className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900">
                  {appointment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}