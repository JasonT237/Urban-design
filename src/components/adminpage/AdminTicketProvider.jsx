import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AdminTicketContext } from "./adminTicketContextValue";
import {
  getAdminTicket,
  listAdminTickets,
  replyToAdminTicket,
  updateAdminTicketStatus,
} from "../../services/adminApi";

export function AdminTicketProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [ticketDetail, setTicketDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyBusy, setReplyBusy] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadTickets = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    try {
      const params = { page: 1, per_page: 50 };
      if (statusFilter) params.status = statusFilter;
      const { items, meta: m } = await listAdminTickets(params);
      setTickets(items);
      setMeta(m);
      setSelectedTicketId((current) => {
        if (current && items.some((t) => t.id === current)) return current;
        return items[0]?.id ?? null;
      });
    } catch (err) {
      console.error(err);
      setListError(err.message || "Could not load tickets.");
    } finally {
      setLoadingList(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const loadTicketDetail = useCallback(async (id) => {
    if (!id) {
      setTicketDetail(null);
      return;
    }
    setDetailLoading(true);
    setDetailError("");
    try {
      const data = await getAdminTicket(id);
      setTicketDetail(data);
    } catch (err) {
      console.error(err);
      setDetailError(err.message || "Could not load ticket.");
      setTicketDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTicketDetail(selectedTicketId);
  }, [selectedTicketId, loadTicketDetail]);

  const sendReply = useCallback(async () => {
    if (!selectedTicketId || !replyText.trim()) return;
    setReplyBusy(true);
    setDetailError("");
    try {
      await replyToAdminTicket(selectedTicketId, {
        content: replyText.trim(),
        is_internal: false,
      });
      setReplyText("");
      await loadTicketDetail(selectedTicketId);
      await loadTickets();
    } catch (err) {
      console.error(err);
      setDetailError(err.message || "Could not send reply.");
    } finally {
      setReplyBusy(false);
    }
  }, [selectedTicketId, replyText, loadTicketDetail, loadTickets]);

  const setTicketStatus = useCallback(
    async (status) => {
      if (!selectedTicketId) return;
      setDetailError("");
      try {
        await updateAdminTicketStatus(selectedTicketId, status);
        await loadTicketDetail(selectedTicketId);
        await loadTickets();
      } catch (err) {
        console.error(err);
        setDetailError(err.message || "Could not update status.");
      }
    },
    [selectedTicketId, loadTicketDetail, loadTickets],
  );

  const selectedTicketSummary = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) || null,
    [tickets, selectedTicketId],
  );

  const value = useMemo(
    () => ({
      tickets,
      meta,
      loadingList,
      listError,
      statusFilter,
      setStatusFilter,
      selectedTicketId,
      selectTicket: setSelectedTicketId,
      reloadTickets: loadTickets,
      ticketDetail,
      selectedTicketSummary,
      detailLoading,
      detailError,
      replyText,
      setReplyText,
      sendReply,
      replyBusy,
      setTicketStatus,
    }),
    [
      tickets,
      meta,
      loadingList,
      listError,
      statusFilter,
      selectedTicketId,
      loadTickets,
      ticketDetail,
      selectedTicketSummary,
      detailLoading,
      detailError,
      replyText,
      sendReply,
      replyBusy,
      setTicketStatus,
    ],
  );

  return (
    <AdminTicketContext.Provider value={value}>
      {children}
    </AdminTicketContext.Provider>
  );
}
