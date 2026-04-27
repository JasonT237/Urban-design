import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AmenitiesGrid from "../components/apartment-details/AmenitiesGrid";
import ApartmentDetailsHeader from "../components/apartment-details/ApartmentDetailsHeader";
import ApartmentGallery from "../components/apartment-details/ApartmentGallery";
import DetailsSection from "../components/apartment-details/DetailsSection";
import LocationPreview from "../components/apartment-details/LocationPreview";
import ReservationPanel from "../components/apartment-details/ReservationPanel";
import ReviewsSection from "../components/apartment-details/ReviewsSection";
import NotFound from "../components/NotFound";
import { amenities, reviews } from "../data/apartmentDetailsContent";
import { useApartments } from "../hooks/useApartments";

export default function ApartmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getApartmentById } = useApartments();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  const apartment = getApartmentById(id);

  if (!apartment) {
    return <NotFound />;
  }

  const handleReserveNow = () => {
    navigate(`/booking/${apartment.id}`, {
      state: { checkIn, checkOut, guests },
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8F0] text-slate-900">
      <ApartmentDetailsHeader apartment={apartment} />
      <ApartmentGallery apartment={apartment} />

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <DetailsSection eyebrow="Overview" title="A calm, refined stay in Douala">
              <p className="mt-5 text-sm leading-7 text-slate-600 md:text-base">
                {apartment.description ||
                  "A premium apartment designed for comfort, elegance, and modern city living in Douala."}
              </p>
            </DetailsSection>

            <DetailsSection eyebrow="What this place offers">
              <AmenitiesGrid amenities={amenities} />
            </DetailsSection>

            <ReviewsSection reviews={reviews} />
            <LocationPreview location={apartment.location} />
          </div>

          <ReservationPanel
            apartment={apartment}
            checkIn={checkIn}
            onCheckInChange={setCheckIn}
            checkOut={checkOut}
            onCheckOutChange={setCheckOut}
            guests={guests}
            onGuestsChange={setGuests}
            onReserve={handleReserveNow}
          />
        </div>
      </section>
    </div>
  );
}
