import { useCallback, useEffect, useMemo, useState } from "react";
import {
  listAdminUsers,
  updateUserRole,
  updateUserStatus,
} from "../services/adminApi";

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [query, setQuery] = useState({ search: "", role: "" });

  const activeUsers = useMemo(
    () => users.filter((user) => user.is_active !== false).length,
    [users],
  );

  const pendingUsers = useMemo(
    () => users.filter((user) => user.is_verified === false).length,
    [users],
  );

  const loadUsers = useCallback(async (nextQuery = query) => {
    setLoading(true);
    setError("");

    try {
      const params = { page: 1, per_page: 50 };
      if (nextQuery.search.trim()) params.search = nextQuery.search.trim();
      if (nextQuery.role) params.role = nextQuery.role;

      const { items, meta: nextMeta } = await listAdminUsers(params);
      setUsers(
        items.map((user) => ({
          ...user,
          is_active: user.is_active !== undefined ? user.is_active : true,
        })),
      );
      setMeta(nextMeta || {});
    } catch (err) {
      setError(err.message || "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const applyFilters = () => {
    setQuery({ search, role: roleFilter });
  };

  const changeUserRole = async (id, role) => {
    setBusyId(id);
    setError("");

    try {
      await updateUserRole(id, role);
      await loadUsers();
    } catch (err) {
      setError(err.message || "Could not update user role.");
    } finally {
      setBusyId("");
    }
  };

  const toggleUserStatus = async (id, nextActive) => {
    setBusyId(id);
    setError("");

    try {
      await updateUserStatus(id, nextActive);
      await loadUsers();
    } catch (err) {
      setError(err.message || "Could not update user status.");
    } finally {
      setBusyId("");
    }
  };

  return {
    users,
    meta,
    loading,
    error,
    busyId,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    activeUsers,
    pendingUsers,
    applyFilters,
    changeUserRole,
    toggleUserStatus,
  };
}
