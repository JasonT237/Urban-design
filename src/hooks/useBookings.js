import { useCallback, useEffect, useState } from "react";
import { findBookingList, normalizeBookings } from "../lib/bookingAdapter";
import { cancelBooking, listBookings } from "../services/bookingsApi";

export function useBookings(params = {}) {
  const { page, per_page, status } = params;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const payload = await listBookings({ page, per_page, status });
      const bookingList = findBookingList(payload);
      setBookings(normalizeBookings(bookingList));
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message || "Could not load bookings.");
    } finally {
      setIsLoading(false);
    }
  }, [page, per_page, status]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const cancelBookingById = async (id) => {
    setError("");
    setSuccessMessage("");
    setIsCancelling(id);

    try {
      const cancelledBooking = await cancelBooking(id);
      const normalizedCancelledBooking = cancelledBooking
        ? normalizeBookings([cancelledBooking])[0]
        : null;

      setBookings((currentBookings) =>
        currentBookings.map((booking) => {
          if (booking.id !== id) {
            return booking;
          }

          return (
            normalizedCancelledBooking || {
              ...booking,
              status: "Cancelled",
              rawStatus: "cancelled",
            }
          );
        }),
      );
      setSuccessMessage("Booking cancelled successfully.");
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message || "Could not cancel booking.");
    } finally {
      setIsCancelling("");
    }
  };

  const confirmAndCancelBooking = async (
    id,
    message = "Are you sure you want to cancel this booking?",
  ) => {
    if (!window.confirm(message)) {
      return;
    }

    await cancelBookingById(id);
  };

  return {
    bookings,
    isLoading,
    isCancelling,
    error,
    successMessage,
    reloadBookings: loadBookings,
    cancelBookingById,
    confirmAndCancelBooking,
  };
}
