import DashboardHeader from "../components/dashboard/DashboardHeader";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import StatsGrid from "../components/dashboard/StatsGrid";
import UpcomingReservations from "../components/dashboard/UpcomingReservations";
import PortalLayout from "../components/PortalLayout";
import {
  dashboardStats,
  recentTransactions,
  upcomingReservations,
} from "../data/dashboardContent";

export default function Dashboard() {
  return (
    <PortalLayout active="dashboard">
      <div className="space-y-6">
        <DashboardHeader />
        <StatsGrid stats={dashboardStats} />
        <UpcomingReservations reservations={upcomingReservations} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </PortalLayout>
  );
}
