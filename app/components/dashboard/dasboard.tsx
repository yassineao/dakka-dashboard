import Footer from "./Footer";
import Sidebar from "./Sidebar";
import StatsCards from "./StatsCards";
import Topbar from "./Topbar";
import TransactionsTable from "./TransactionTable";
import BookingsTable  from "./OrderHistoryTable";

export default function DashboardLayout() {
  return (
    <div className=" bg-white ">
      <Topbar />

      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar />

        <div className="relative h-full w-full overflow-y-auto  lg:ml-64">
          <main>
            <div className="px-4 pt-6">
              <div className="grid w-full grid-cols-1 gap-4">
                {/* <TransactionsTable /> */}
                <BookingsTable />
              </div>

              <StatsCards />
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}