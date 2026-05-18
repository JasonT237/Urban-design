import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AdminPortalContext } from "../context/adminPortalContextValue";
import {
  getAdminPermissions,
  listAdminAuditLogs,
  listAdminUsers,
  updateAdminPermissions,
} from "../services/adminApi";
import {
  ADMIN_API_ROLES,
  DEFAULT_PERMISSION_MODULES,
} from "../lib/adminRoles";

function draftKey(role, module) {
  return `${role}::${module}`;
}

function normalizePermissionPayload(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.permissions)) return raw.permissions;
  return [];
}

function buildRowsFromApi(apiRows) {
  if (apiRows.length > 0) return apiRows;
  const synthetic = [];
  for (const role of ADMIN_API_ROLES) {
    for (const def of DEFAULT_PERMISSION_MODULES) {
      synthetic.push({
        id: `${role}-${def.module}`,
        role,
        module: def.module,
        can_read: role === "admin",
        can_write: role === "admin",
        can_delete: false,
        can_approve: role === "admin",
      });
    }
  }
  return synthetic;
}

export function AdminPortalProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [permissionRows, setPermissionRows] = useState([]);
  const [permissionDraft, setPermissionDraft] = useState({});
  const [selectedPermissionRole, setSelectedPermissionRole] = useState("admin");
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [permissionsSaving, setPermissionsSaving] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const [roleUserCounts, setRoleUserCounts] = useState({
    admin: 0,
    homeowner: 0,
    guest: 0,
  });

  const loadPermissions = useCallback(async () => {
    setPermissionsLoading(true);
    setPermissionError("");
    try {
      const raw = await getAdminPermissions();
      const list = normalizePermissionPayload(raw);
      setPermissionRows(buildRowsFromApi(list));
      setPermissionDraft({});
    } catch (err) {
      console.error(err);
      setPermissionError(err.message || "Could not load permissions.");
      setPermissionRows(buildRowsFromApi([]));
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  const loadRoleCounts = useCallback(async () => {
    try {
      const { items } = await listAdminUsers({ page: 1, per_page: 200 });
      const next = { admin: 0, homeowner: 0, guest: 0 };
      for (const user of items) {
        if (user.role in next) {
          next[user.role]++;
        }
      }
      setRoleUserCounts(next);
    } catch {
      // Counts are optional; ignore list errors
    }
  }, []);

  useEffect(() => {
    loadPermissions();
    loadRoleCounts();
  }, [loadPermissions, loadRoleCounts]);

  const effectivePermission = useCallback(
    (role, module) => {
      const base = permissionRows.find(
        (row) => row.role === role && row.module === module,
      );
      const overrides = permissionDraft[draftKey(role, module)] || {};
      if (!base) {
        return {
          role,
          module,
          can_read: Boolean(overrides.can_read),
          can_write: Boolean(overrides.can_write),
          can_delete: Boolean(overrides.can_delete),
          can_approve: Boolean(overrides.can_approve),
        };
      }
      return { ...base, ...overrides };
    },
    [permissionRows, permissionDraft],
  );

  const updatePermissionFlag = useCallback((role, module, field, value) => {
    const key = draftKey(role, module);
    setPermissionDraft((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }, []);

  const resetPermissionDraft = useCallback(() => {
    setPermissionDraft({});
    setPermissionError("");
  }, []);

  const savePermissions = useCallback(async () => {
    setPermissionsSaving(true);
    setPermissionError("");
    try {
      const permissions = [];
      for (const row of permissionRows) {
        const eff = effectivePermission(row.role, row.module);
        permissions.push({
          role: row.role,
          module: row.module,
          can_read: Boolean(eff.can_read),
          can_write: Boolean(eff.can_write),
          can_delete: Boolean(eff.can_delete),
          can_approve: Boolean(eff.can_approve),
        });
      }
      await updateAdminPermissions({ permissions });
      setPermissionDraft({});
      await loadPermissions();
    } catch (err) {
      console.error(err);
      setPermissionError(err.message || "Could not save permissions.");
    } finally {
      setPermissionsSaving(false);
    }
  }, [permissionRows, effectivePermission, loadPermissions]);

  const exportAuditLogs = useCallback(async () => {
    try {
      const { items } = await listAdminAuditLogs({ page: 1, per_page: 500 });
      const blob = new Blob([JSON.stringify(items, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not export audit logs.");
    }
  }, []);

  const modulesForMatrix = useMemo(() => {
    const set = new Set();
    permissionRows
      .filter((r) => r.role === selectedPermissionRole)
      .forEach((r) => set.add(r.module));
    if (set.size === 0) {
      DEFAULT_PERMISSION_MODULES.forEach((d) => set.add(d.module));
    }
    return [...set].sort();
  }, [permissionRows, selectedPermissionRole]);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((c) => !c),
      permissionRows,
      permissionDraft,
      selectedPermissionRole,
      setSelectedPermissionRole,
      modulesForMatrix,
      effectivePermission,
      updatePermissionFlag,
      resetPermissionDraft,
      savePermissions,
      permissionsLoading,
      permissionsSaving,
      permissionError,
      reloadPermissions: loadPermissions,
      roleUserCounts,
      exportAuditLogs,
    }),
    [
      sidebarCollapsed,
      permissionRows,
      permissionDraft,
      selectedPermissionRole,
      modulesForMatrix,
      effectivePermission,
      updatePermissionFlag,
      resetPermissionDraft,
      savePermissions,
      permissionsLoading,
      permissionsSaving,
      permissionError,
      loadPermissions,
      roleUserCounts,
      exportAuditLogs,
    ],
  );

  return (
    <AdminPortalContext.Provider value={value}>
      {children}
    </AdminPortalContext.Provider>
  );
}
