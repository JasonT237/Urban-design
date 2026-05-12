import { useEffect, useState } from "react";
import { findProperty, normalizeProperty } from "../lib/propertyAdapter";
import { getProperty } from "../services/propertiesApi";
import { useApartments } from "./useApartments";

export function useApartmentResource(id) {
  const { getApartmentById } = useApartments();
  const staticApartment = getApartmentById(id);
  const [apiApartment, setApiApartment] = useState(null);
  const [isLoading, setIsLoading] = useState(() => !staticApartment);
  const [error, setError] = useState("");

  useEffect(() => {
    if (staticApartment) {
      setApiApartment(null);
      setIsLoading(false);
      setError("");
      return;
    }

    let shouldIgnore = false;

    const loadApartment = async () => {
      setIsLoading(true);
      setError("");

      try {
        const payload = await getProperty(id);
        const property = normalizeProperty(findProperty(payload));

        if (!shouldIgnore) {
          setApiApartment(property);
        }
      } catch (requestError) {
        console.error(requestError);

        if (!shouldIgnore) {
          setError(requestError.message || "Could not load apartment.");
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      }
    };

    loadApartment();

    return () => {
      shouldIgnore = true;
    };
  }, [id, staticApartment]);

  return {
    apartment: apiApartment || staticApartment,
    isLoading,
    error,
  };
}
