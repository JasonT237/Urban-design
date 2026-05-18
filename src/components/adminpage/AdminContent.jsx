import { useCallback, useEffect, useState } from "react";
import {
  getAdminSiteConfig,
  updateAdminSiteConfig,
} from "../../services/adminApi";

const TOOLBAR_ITEMS = ["B", "I", "U", "Align", "List", "Link", "Image"];

function ConfigRow({ entry, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className={`flex w-full flex-col rounded-xl border px-3 py-2.5 text-left text-sm transition ${
        isSelected
          ? "border-sky-500 bg-sky-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span className="font-semibold text-slate-900">{entry.key}</span>
      {entry.description && (
        <span className="mt-0.5 line-clamp-2 text-xs text-slate-500">
          {entry.description}
        </span>
      )}
    </button>
  );
}

export default function AdminContent() {
  const [configs, setConfigs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draftValue, setDraftValue] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const raw = await getAdminSiteConfig();
      const list = Array.isArray(raw) ? raw : raw?.items ?? [];
      setConfigs(list);
      setSelected((previous) => {
        if (previous && list.some((entry) => entry.key === previous.key)) {
          return previous;
        }

        return list[0] ?? null;
      });
    } catch (err) {
      setError(err.message || "Could not load site configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (selected) {
      setDraftValue(selected.value ?? "");
      setDraftDescription(selected.description ?? "");
    }
  }, [selected]);

  const save = async () => {
    if (!selected) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateAdminSiteConfig(selected.key, {
        value: draftValue,
        description: draftDescription || undefined,
      });
      setSuccess(`Updated ${selected.key}.`);
      await load();
    } catch (err) {
      setError(err.message || "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          Content Editor
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Site configuration
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Edit reusable site copy and settings so admins can update marketing
          strings without redeploying the app.
        </p>
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {success}
          </p>
        )}
      </header>

      {loading ? (
        <p className="text-slate-500">Loading configuration keys...</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Editable keys
            </p>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {configs.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No keys returned yet. Add content keys from the backend admin
                  tools first.
                </p>
              ) : (
                configs.map((entry) => (
                  <ConfigRow
                    key={entry.id || entry.key}
                    entry={entry}
                    isSelected={selected?.key === entry.key}
                    onSelect={setSelected}
                  />
                ))
              )}
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
              {TOOLBAR_ITEMS.map((item) => (
                <span
                  key={item}
                  className="inline-flex h-8 min-w-8 cursor-default items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-600"
                  title="Formatting control placeholder"
                >
                  {item}
                </span>
              ))}
            </div>

            {selected ? (
              <textarea
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
                rows={18}
                className="w-full rounded-xl border border-slate-300 p-4 font-mono text-sm leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            ) : (
              <p className="text-slate-500">Select a key to edit its value.</p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!selected || saving}
                onClick={save}
                className="rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-50"
              >
                {saving ? "Publishing..." : "Publish updates"}
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => selected && setDraftValue(selected.value ?? "")}
              >
                Revert
              </button>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Metadata
              </p>
              {selected ? (
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-500">Key</dt>
                    <dd className="font-mono text-slate-900">{selected.key}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Updated</dt>
                    <dd className="text-slate-800">
                      {selected.updated_at
                        ? new Date(selected.updated_at).toLocaleString()
                        : "Not available"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Description</dt>
                    <dd>
                      <textarea
                        value={draftDescription}
                        onChange={(event) =>
                          setDraftDescription(event.target.value)
                        }
                        rows={4}
                        className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"
                      />
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Nothing selected.</p>
              )}
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">CMS note</p>
              <p className="mt-2 leading-relaxed">
                This version focuses on global content values. A full page
                builder and media library can be added as separate admin tools.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
