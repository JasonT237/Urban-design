export function getApartmentCategories(apartments) {
  const categories = apartments
    .map((apartment) => apartment.category)
    .filter(Boolean);

  return ["All", ...new Set(categories)];
}

export function getApartmentArea(apartment) {
  return apartment.location?.split(",")[0]?.trim() || "";
}

export function getApartmentNeighborhoods(apartments) {
  return [
    ...new Set(
      apartments
        .map(getApartmentArea)
        .filter(Boolean),
    ),
  ];
}

export function getApartmentAmenities(apartments) {
  return [
    ...new Set(
      apartments
        .flatMap((apartment) => apartment.amenities || [])
        .filter(Boolean),
    ),
  ];
}

export function formatAmenityLabel(amenity) {
  return amenity
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function filterApartmentList(
  apartments,
  {
    search = "",
    location = "",
    area = "",
    guests = "All",
    category = "All",
    amenity = "All",
  } = {},
) {
  const normalizedSearch = (search || location).trim().toLowerCase();
  const normalizedArea = area.trim().toLowerCase();
  const normalizedAmenity = amenity.trim().toLowerCase();

  return apartments.filter((apartment) => {
    const apartmentArea = getApartmentArea(apartment).toLowerCase();
    const apartmentAmenities = (apartment.amenities || []).map((item) =>
      item.toLowerCase(),
    );
    const searchableText = [
      apartment.title,
      apartment.location,
      apartment.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch || searchableText.includes(normalizedSearch);

    const matchesArea = !normalizedArea || apartmentArea === normalizedArea;

    const matchesGuests =
      guests === "All" || Number(apartment.guests) >= Number(guests);

    const matchesCategory =
      category === "All" || apartment.category === category;

    const matchesAmenity =
      amenity === "All" || apartmentAmenities.includes(normalizedAmenity);

    return (
      matchesSearch &&
      matchesArea &&
      matchesGuests &&
      matchesCategory &&
      matchesAmenity
    );
  });
}
