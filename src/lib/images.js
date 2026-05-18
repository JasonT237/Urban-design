import { FALLBACK_PROPERTY_IMAGE } from "./constants";

export function pickPropertyImage(property) {
  if (!property) return FALLBACK_PROPERTY_IMAGE;

  const images = property.images || property.photos || [];

  return (
    property.image ||
    property.image_url ||
    property.cover_image ||
    property.thumbnail ||
    images[0]?.url ||
    images[0] ||
    FALLBACK_PROPERTY_IMAGE
  );
}
