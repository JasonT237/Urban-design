import { useAdminPortal } from "../../hooks/useAdminPortal";
import {
  ADMIN_API_ROLES,
  ADMIN_ROLE_META,
  DEFAULT_PERMISSION_MODULES,
} from "../../lib/adminRoles";

function PermissionToggle({ checked, disabled, onChange, label }) {
  return (
    <label className="flex flex-col items-center gap-1">
      <button
        type="button"
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? "bg-sky-600" : "bg-slate-300"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </button>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </label>
  );
}

const FIELD_LABELS = {
  can_read: "Read",
  can_write: "Write",
  can_delete: "Delete",
  can_approve: "Approve",
};

function RoleCard({ role, selected, meta, userCount, onSelect }) {
  const active = selected === role;
  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className={`flex w-full flex-col rounded-2xl border-2 p-5 text-left transition ${
        active
          ? "border-sky-500 bg-sky-50 shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-sky-800">{meta.label}</p>
          <p className="text-xs text-slate-500">{meta.subtitle}</p>
        </div>
        {active && (
          <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white">
            Active
          </span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{meta.description}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {userCount} users assigned
      </p>
    </button>
  );
}

function moduleMeta(moduleId) {
  return DEFAULT_PERMISSION_MODULES.find((m) => m.module === moduleId);
}

export default function AdminSettingss() {
  const {
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
    roleUserCounts,
    exportAuditLogs,
  } = useAdminPortal();

  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Security Settings
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Roles & permissions
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Configure global access controls, define organizational roles, and
            manage granular permissions for Urban Sanctuary modules.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetPermissionDraft}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Reset changes
          </button>
          <button
            type="button"
            disabled={permissionsSaving || permissionsLoading}
            onClick={savePermissions}
            className="rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-50"
          >
            {permissionsSaving ? "Saving…" : "Save permissions"}
          </button>
        </div>
      </header>

      {permissionError && (
        <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {permissionError}
        </p>
      )}

      {permissionsLoading ? (
        <p className="text-slate-500">Loading permission matrix…</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {ADMIN_API_ROLES.map((role) => (
              <RoleCard
                key={role}
                role={role}
                selected={selectedPermissionRole}
                meta={ADMIN_ROLE_META[role]}
                userCount={roleUserCounts[role] ?? 0}
                onSelect={setSelectedPermissionRole}
              />
            ))}
          </div>

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Permission matrix — {ADMIN_ROLE_META[selectedPermissionRole]?.label}
              </h2>
              <p className="text-xs text-slate-500">
                Changes apply to the selected API role after Save (server validates).
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="py-3 pr-4">Module</th>
                    <th className="px-2 py-3 text-center">Read</th>
                    <th className="px-2 py-3 text-center">Write</th>
                    <th className="px-2 py-3 text-center">Delete</th>
                    <th className="px-2 py-3 text-center">Approve</th>
                  </tr>
                </thead>
                <tbody>
                  {modulesForMatrix.map((moduleId) => {
                    const meta = moduleMeta(moduleId);
                    const eff = effectivePermission(
                      selectedPermissionRole,
                      moduleId,
                    );
                    return (
                      <tr key={moduleId} className="border-b border-slate-100">
                        <td className="py-4 pr-4">
                          <p className="font-semibold capitalize text-slate-900">
                            {meta?.label || moduleId}
                          </p>
                          <p className="text-xs text-slate-500">
                            {meta?.description || ""}
                          </p>
                        </td>
                        {["can_read", "can_write", "can_delete", "can_approve"].map(
                          (field) => (
                            <td key={field} className="px-2 py-4 text-center">
                              <PermissionToggle
                                label={FIELD_LABELS[field]}
                                checked={Boolean(eff[field])}
                                disabled={permissionsSaving}
                                onChange={(next) =>
                                  updatePermissionFlag(
                                    selectedPermissionRole,
                                    moduleId,
                                    field,
                                    next,
                                  )
                                }
                              />
                            </td>
                          ),
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Affects{" "}
              <strong>{roleUserCounts[selectedPermissionRole] ?? 0}</strong> accounts with
              role <strong>{selectedPermissionRole}</strong>.{" "}
              <button
                type="button"
                className="font-semibold text-sky-700 hover:underline"
                onClick={() => exportAuditLogs()}
              >
                Download audit log
              </button>{" "}
              from the sidebar export action.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
