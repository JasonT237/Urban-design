const fallbackImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

export function findPropertyList(payload) {
  const possibleLists = [
    payload,
    payload?.data,
    payload?.data?.data,
    payload?.data?.properties,
    payload?.data?.items,
    payload?.meta?.data,
    payload?.meta?.properties,
    payload?.meta?.items,
  ];

  return possibleLists.find(Array.isArray) || [];
}

export function findProperty(payload) {
  return (
    payload?.data?.property ||
    payload?.data ||
    payload?.property ||
    payload ||
    null
  );
}

export function normalizeProperty(property) {
  if (!property) {
    return null;
  }

  const images = property.images || property.photos || [];
  const firstImage =
    property.image ||
    property.image_url ||
    property.cover_image ||
    property.thumbnail ||
    images[0]?.url ||
    images[0] ||
    fallbackImage;

  const locationParts = [
    property.neighborhood,
    property.city,
  ].filter(Boolean);

  return {
    id: property.id || property.uuid || property.property_id,
    title: property.title || property.name || "Untitled property",
    location:
      property.location ||
      property.address ||
      locationParts.join(", ") ||
      "Douala",
    price:
      property.price ||
      property.price_per_night ||
      property.nightly_price ||
      property.base_price ||
      0,
    image: firstImage,
    guests: property.guests || property.max_guests || property.capacity || 1,
    beds: property.beds || property.bedrooms || 1,
    baths: property.baths || property.bathrooms || 1,
    category: property.category || property.type || "Apartment",
    tag: property.tag || property.status || "",
    description: property.description || property.summary || "",
    amenities: property.amenities || [],
  };
}

export function normalizeProperties(properties) {
  return properties.map(normalizeProperty).filter(Boolean);
}
