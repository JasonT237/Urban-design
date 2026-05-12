import { useEffect, useState } from "react";
import { findPropertyList, normalizeProperties } from "../lib/propertyAdapter";
import { listProperties } from "../services/propertiesApi";

export function useProperties(params = {}) {
  const {
    neighborhood,
    min_price,
    max_price,
    bedrooms,
    max_guests,
    sort_by,
    sort_order,
    search,
    page,
    per_page,
  } = params;
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let shouldIgnore = false;

    const loadProperties = async () => {
      setIsLoading(true);
      setError("");

      try {
        const payload = await listProperties({
          neighborhood,
          min_price,
          max_price,
          bedrooms,
          max_guests,
          sort_by,
          sort_order,
          search,
          page,
          per_page,
        });
        const propertyList = findPropertyList(payload);

        if (!shouldIgnore) {
          setProperties(normalizeProperties(propertyList));
        }
      } catch (requestError) {
        console.error(requestError);

        if (!shouldIgnore) {
          setError(requestError.message || "Could not load properties.");
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      shouldIgnore = true;
    };
  }, [
    neighborhood,
    min_price,
    max_price,
    bedrooms,
    max_guests,
    sort_by,
    sort_order,
    search,
    page,
    per_page,
  ]);

  return {
    properties,
    isLoading,
    error,
  };
}
