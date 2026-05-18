import { AdminTicketProvider } from "./AdminTicketProvider";
import { useAdminTickets } from "../../hooks/useAdminTickets";

function priorityClass(p) {
  switch (p) {
    case "urgent":
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-200 text-slate-700";
  }
}

function TicketListPanel() {
  const {
    tickets,
    meta,
    loadingList,
    listError,
    statusFilter,
    setStatusFilter,
    selectedTicketId,
    selectTicket,
  } = useAdminTickets();

  const filters = [
    { value: "", label: "All" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Support Tickets</h2>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800">
            {meta?.total ?? tickets.length} total
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {filters.map((f) => (
            <button
              key={f.value || "all"}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusFilter === f.value
                  ? "bg-sky-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {loadingList && <p className="p-4 text-sm text-slate-500">Loading…</p>}
        {listError && (
          <p className="p-4 text-sm text-red-600">{listError}</p>
        )}
        {!loadingList &&
          tickets.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTicket(t.id)}
              className={`mb-2 w-full rounded-xl border px-3 py-3 text-left transition ${
                selectedTicketId === t.id
                  ? "border-sky-400 bg-sky-50"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] text-slate-400">
                  #{String(t.id).slice(0, 8)}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${priorityClass(t.priority)}`}
                >
                  {t.priority || "low"}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">
                {t.subject}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {t.user?.email || "User"} · {t.status}
              </p>
            </button>
          ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, isStaff }) {
  return (
    <div
      className={`flex ${isStaff ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
          isStaff
            ? "bg-sky-700 text-white"
            : "border border-slate-200 bg-slate-50 text-slate-800"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p
          className={`mt-2 text-[10px] ${
            isStaff ? "text-sky-200" : "text-slate-400"
          }`}
        >
          {message.created_at
            ? new Date(message.created_at).toLocaleString()
            : ""}
          {message.is_internal && " · Internal"}
        </p>
      </div>
    </div>
  );
}

function ConversationPanel() {
  const {
    ticketDetail,
    selectedTicketSummary,
    detailLoading,
    detailError,
    replyText,
    setReplyText,
    sendReply,
    replyBusy,
    setTicketStatus,
  } = useAdminTickets();

  if (!selectedTicketSummary && !ticketDetail) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-slate-500">
        Select a ticket from the list.
      </div>
    );
  }

  const messages = ticketDetail?.messages ?? [];
  const adminRole = "admin";

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
              Ticket
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {ticketDetail?.subject || selectedTicketSummary?.subject}
            </h2>
            <p className="text-xs text-slate-500">
              {ticketDetail?.status || selectedTicketSummary?.status} · Priority:{" "}
              {ticketDetail?.priority || selectedTicketSummary?.priority}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTicketStatus("resolved")}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Mark resolved
            </button>
            <button
              type="button"
              onClick={() => setTicketStatus("in_progress")}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              In progress
            </button>
          </div>
        </div>
      </div>

      {detailError && (
        <p className="mx-4 mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {detailError}
        </p>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {detailLoading ? (
          <p className="text-sm text-slate-500">Loading thread…</p>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              isStaff={m.sender?.role === adminRole}
            />
          ))
        )}
      </div>

      <div className="border-t border-slate-100 p-4">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
          placeholder="Type a reply… (POST /admin/tickets/{id}/reply)"
          className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            disabled={replyBusy}
            onClick={sendReply}
            className="rounded-xl bg-sky-700 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-50"
          >
            {replyBusy ? "Sending…" : "Send reply"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserContextPanel() {
  const { ticketDetail, selectedTicketSummary } = useAdminTickets();
  const user = ticketDetail?.user || selectedTicketSummary?.user;

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-sm text-slate-500">
        User context appears when the ticket payload includes <code>user</code>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Requester
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          {[user.first_name, user.last_name].filter(Boolean).join(" ") ||
            user.email}
        </p>
        <p className="text-sm text-slate-600">{user.email}</p>
        <p className="mt-2 text-xs text-slate-400">
          Role: {user.role} · Points: {user.loyalty_points ?? 0}
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Internal notes</p>
        <p className="mt-2 leading-relaxed">
          Extend with a dedicated notes endpoint or{" "}
          <code className="rounded bg-white px-1">is_internal</code> replies on
          the ticket thread.
        </p>
      </div>
    </div>
  );
}

function AdminSupportInner() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Support Tickets</h1>
        <p className="mt-1 text-slate-600">
          Three-column layout · List / Thread / User context. Data from{" "}
          <code className="rounded bg-slate-200 px-1 text-sm">/admin/tickets</code>
        </p>
      </header>
      <div className="grid h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,260px)]">
        <TicketListPanel />
        <ConversationPanel />
        <UserContextPanel />
      </div>
    </div>
  );
}

export default function AdminSupport() {
  return (
    <AdminTicketProvider>
      <AdminSupportInner />
    </AdminTicketProvider>
  );
}
