import { calculateNights, capitalize, formatShortDate, formatXAF } from "./format";
import { pickPropertyImage } from "./images";

export const formatBookingDate = formatShortDate;

export function formatBookingStatus(status) {
  return status ? capitalize(status) : "Pending";
}

export function findBookingList(payload) {
  const possibleLists = [
    payload,
    payload?.data,
    payload?.data?.bookings,
    payload?.data?.items,
    payload?.bookings,
    payload?.items,
  ];

  return possibleLists.find(Array.isArray) || [];
}

export function normalizeBooking(booking) {
  const property = booking?.property || {};
  const rawStatus = booking?.status || "pending";
  const checkIn = booking?.check_in || booking?.checkIn;
  const checkOut = booking?.check_out || booking?.checkOut;
  const totalAmount = booking?.total_amount || booking?.total || 0;

  return {
    id: booking?.id,
    title: property.title || booking?.title || "Reserved apartment",
    location: property.address || property.neighborhood || "Douala",
    checkIn,
    checkOut,
    formattedCheckIn: formatBookingDate(checkIn),
    formattedCheckOut: formatBookingDate(checkOut),
    amount: formatXAF(totalAmount),
    totalAmount,
    status: formatBookingStatus(rawStatus),
    rawStatus,
    image: pickPropertyImage(property),
    nights: calculateNights(checkIn, checkOut),
  };
}

export function normalizeBookings(bookings) {
  return bookings.map(normalizeBooking).filter((booking) => booking.id);
}

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

function isCancellableStatus(rawStatus) {
  return CANCELLABLE_STATUSES.includes(rawStatus?.toLowerCase());
}

export function canCancelBooking(booking, isAdmin) {
  return !isAdmin && isCancellableStatus(booking.rawStatus);
}

export function getUpcomingBookings(bookings) {
  return bookings.filter((booking) => isCancellableStatus(booking.rawStatus));
}

export function buildBookingStats(bookings, loyaltyPoints = 0) {
  const activeBookings = getUpcomingBookings(bookings).length;
  const nightsStayed = bookings.reduce(
    (total, booking) => total + (booking.nights || 0),
    0,
  );

  return [
    {
      label: "Total",
      value: nightsStayed.toString(),
      caption: "Nights booked",
    },
    {
      label: "Current",
      value: activeBookings.toString(),
      caption: "Active bookings",
    },
    {
      label: "Tier",
      value: loyaltyPoints.toLocaleString(),
      caption: "Loyalty points",
    },
  ];
}

export function buildBookingTransactions(bookings) {
  return bookings.slice(0, 5).map((booking) => ({
    id: booking.id,
    title: `${booking.title} stay`,
    date: booking.formattedCheckIn,
    amount: booking.amount,
  }));
}
