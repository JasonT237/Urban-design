import DashboardHeader from "../components/dashboard/DashboardHeader";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import StatsGrid from "../components/dashboard/StatsGrid";
import UpcomingReservations from "../components/dashboard/UpcomingReservations";
import PortalLayout from "../components/PortalLayout";
import StatusMessage from "../components/StatusMessage";
import {
  buildBookingStats,
  buildBookingTransactions,
  canCancelBooking,
  getUpcomingBookings,
} from "../lib/bookingAdapter";
import { useBookings } from "../hooks/useBookings";
import { useProfile } from "../hooks/useProfile";
import { useUserRole } from "../hooks/useUserRole";

const SILVER_STATUS_TARGET_NIGHTS = 15;

function getUserName(user) {
  return user?.first_name || user?.firstName || user?.name || "there";
}

function buildMemberStatus(nightsBooked) {
  const remainingNights = Math.max(
    SILVER_STATUS_TARGET_NIGHTS - nightsBooked,
    0,
  );

  return {
    message:
      remainingNights > 0
        ? `You're ${remainingNights} nights away from Silver Status.`
        : "You have reached Silver Status.",
    progress: Math.min(
      (nightsBooked / SILVER_STATUS_TARGET_NIGHTS) * 100,
      100,
    ),
  };
}

function sumNights(bookings) {
  return bookings.reduce(
    (total, booking) => total + (booking.nights || 0),
    0,
  );
}

export default function Dashboard() {
  const { isAdmin } = useUserRole();
  const {
    bookings,
    isLoading,
    isCancelling,
    error,
    successMessage,
    confirmAndCancelBooking,
  } = useBookings({ page: 1, per_page: 20 });
  const { user } = useProfile();

  const loyaltyPoints = user?.loyalty_points || 0;
  const dashboardStats = buildBookingStats(bookings, loyaltyPoints);
  const memberStatus = buildMemberStatus(sumNights(bookings));
  const upcomingReservations = getUpcomingBookings(bookings).slice(0, 2);
  const recentTransactions = buildBookingTransactions(bookings);

  return (
    <PortalLayout active="dashboard" memberStatus={memberStatus}>
      <div className="space-y-6">
        <DashboardHeader userName={getUserName(user)} />
        <StatsGrid stats={dashboardStats} />

        {isLoading && (
          <StatusMessage tone="info" message="Loading your bookings..." />
        )}
        <StatusMessage tone="error" message={error} />
        <StatusMessage tone="success" message={successMessage} />

        {!isLoading && !error && (
          <UpcomingReservations
            reservations={upcomingReservations}
            canCancel={(booking) => canCancelBooking(booking, isAdmin)}
            isCancelling={isCancelling}
            onCancel={confirmAndCancelBooking}
          />
        )}

        <RecentTransactions transactions={recentTransactions} />
      </div>
    </PortalLayout>
  );
}
