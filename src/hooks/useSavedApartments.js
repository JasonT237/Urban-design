import { useEffect, useState } from "react";

const STORAGE_KEY = "saved_apartment_ids";
const CHANGE_EVENT = "saved-apartments-changed";

function readSavedApartmentIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").map(String);
  } catch {
    return [];
  }
}

function writeSavedApartmentIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useSavedApartments() {
  const [savedApartmentIds, setSavedApartmentIds] = useState(
    readSavedApartmentIds,
  );

  useEffect(() => {
    const syncSavedApartmentIds = () => {
      setSavedApartmentIds(readSavedApartmentIds());
    };

    window.addEventListener("storage", syncSavedApartmentIds);
    window.addEventListener(CHANGE_EVENT, syncSavedApartmentIds);

    return () => {
      window.removeEventListener("storage", syncSavedApartmentIds);
      window.removeEventListener(CHANGE_EVENT, syncSavedApartmentIds);
    };
  }, []);

  const isApartmentSaved = (id) => savedApartmentIds.includes(String(id));

  const saveApartment = (id) => {
    const nextIds = [...new Set([...savedApartmentIds, String(id)])];
    setSavedApartmentIds(nextIds);
    writeSavedApartmentIds(nextIds);
  };

  const removeSavedApartment = (id) => {
    const nextIds = savedApartmentIds.filter(
      (savedId) => savedId !== String(id),
    );
    setSavedApartmentIds(nextIds);
    writeSavedApartmentIds(nextIds);
  };

  const toggleSavedApartment = (id) => {
    if (isApartmentSaved(id)) {
      removeSavedApartment(id);
      return;
    }

    saveApartment(id);
  };

  return {
    savedApartmentIds,
    isApartmentSaved,
    saveApartment,
    removeSavedApartment,
    toggleSavedApartment,
  };
}
