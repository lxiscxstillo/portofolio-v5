import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabase";
import {
  MessageSquare,
  Pin,
  Trash2,
  PinOff,
  Calendar,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";

const PAGE_SIZE = 10;

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffffff] to-[#e5e7eb] rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500 pointer-events-none" />
    <div className="relative bg-[#141414] backdrop-blur-xl border border-white/20 rounded-2xl h-full">
      {children}
    </div>
  </div>
);

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null); // id of comment being acted on

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_comments")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) console.error("fetchComments error:", error);
    setComments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const pin = async (id, value) => {
    setActionLoading(id);
    try {
      if (value) {
        // Unpin any currently pinned comment first (only one pinned at a time)
        const { error: unpinErr } = await supabase
          .from("portfolio_comments")
          .update({ is_pinned: false })
          .eq("is_pinned", true);
        if (unpinErr) throw unpinErr;
      }
      const { error } = await supabase
        .from("portfolio_comments")
        .update({ is_pinned: value })
        .eq("id", id);
      if (error) throw error;
      await fetchComments();
    } catch (err) {
      console.error("pin error:", err);
      alert("Failed to update pin status: " + (err.message || err));
    } finally {
      setActionLoading(null);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this comment?")) return;
    setActionLoading(id);
    try {
      // .select() returns the deleted rows — if empty, RLS silently blocked it
      const { data: deleted, error } = await supabase
        .from("portfolio_comments")
        .delete()
        .eq("id", id)
        .select();
      if (error) throw error;
      if (!deleted || deleted.length === 0) {
        alert(
          "Delete was blocked by Supabase RLS.\n\n" +
          "Fix: go to Supabase → Table Editor → portfolio_comments → RLS Policies → add a DELETE policy that allows authenticated admins.\n\n" +
          "Example policy:\nUSING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))"
        );
        return;
      }
      await fetchComments();
    } catch (err) {
      console.error("delete error:", err);
      alert("Failed to delete comment: " + (err.message || err));
    } finally {
      setActionLoading(null);
    }
  };

  const pinnedCount = comments.filter((c) => c.is_pinned).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Filter + search
  const filtered = useMemo(() => {
    let result =
      filter === "pinned" ? comments.filter((c) => c.is_pinned) : comments;
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (c) =>
          (c.user_name || "").toLowerCase().includes(q) ||
          (c.content || "").toLowerCase().includes(q) ||
          (c.user_role || "").toLowerCase().includes(q) ||
          (c.user_company || "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [comments, filter, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffffff] to-[#e5e7eb] rounded-xl blur opacity-50 pointer-events-none" />
            <div className="relative w-9 h-9 bg-[#0A0A0A] rounded-xl border border-white/15 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Comments
            </h1>
            <p className="text-gray-500 text-xs">
              {comments.length} total · {pinnedCount} pinned
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {[
            { value: "all", label: "All", count: comments.length },
            { value: "pinned", label: "Pinned", count: pinnedCount },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                filter === tab.value
                  ? "bg-gradient-to-r from-white/25 to-gray-400/20 border border-white/35 text-white font-medium"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  filter === tab.value
                    ? "bg-white/25 text-white"
                    : "bg-white/8 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: comments.length, color: "text-white" },
          { label: "Pinned", value: pinnedCount, color: "text-gray-200" },
          {
            label: "Unpinned",
            value: comments.length - pinnedCount,
            color: "text-white",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="p-3 sm:p-4">
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, role, company, or message..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result count when searching */}
      {search && (
        <p className="text-xs text-gray-500 -mt-3">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
          {search}"
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-white/10 border-t-white rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <Card>
          <div className="p-14 text-center">
            <MessageSquare className="w-10 h-10 text-white/25 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">
              {search
                ? "No comments match your search."
                : filter === "pinned"
                  ? "No pinned comments."
                  : "No comments yet."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {paginated.map((comment) => (
            <div key={comment.id} className="relative group">
              {comment.is_pinned && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ffffff] to-[#e5e7eb] rounded-2xl blur opacity-15 pointer-events-none" />
              )}
              <div
                className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl px-4 py-4 sm:px-5 transition-all duration-200 ${
                  comment.is_pinned
                    ? "border-white/30"
                    : "border-white/10 hover:border-white/18"
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-white font-semibold text-sm uppercase">
                    {(comment.user_name || "A").charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-white">
                        {highlightMatch(
                          comment.user_name || "Anonymous",
                          search,
                        )}
                      </span>
                      {comment.is_pinned && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 border border-white/25 text-white text-xs">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-600 text-xs ml-auto shrink-0">
                        <Calendar className="w-3 h-3" />
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    {(comment.user_role || comment.user_company) && (
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 opacity-60 shrink-0" />
                        {comment.user_role && comment.user_company
                          ? `${comment.user_role} at ${comment.user_company}`
                          : comment.user_role || comment.user_company}
                      </p>
                    )}
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {highlightMatch(comment.content || "", search)}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => pin(comment.id, !comment.is_pinned)}
                      disabled={actionLoading === comment.id}
                      title={comment.is_pinned ? "Unpin" : "Pin"}
                      className={`p-2 rounded-lg border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                        comment.is_pinned
                          ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                          : "border-white/10 text-gray-500 hover:text-white hover:border-white/25"
                      }`}
                    >
                      {actionLoading === comment.id ? (
                        <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : comment.is_pinned ? (
                        <PinOff className="w-3.5 h-3.5" />
                      ) : (
                        <Pin className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => remove(comment.id)}
                      disabled={actionLoading === comment.id}
                      className="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {actionLoading === comment.id ? (
                        <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-gray-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, i, arr) => {
                if (i > 0 && arr[i - 1] !== p - 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="px-2 text-gray-600 text-xs"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs border transition-all duration-200 ${
                      page === p
                        ? "bg-white/20 border-white/40 text-white font-medium"
                        : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Highlight matching text
function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const regex = new RegExp(
    `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-white/30 text-white rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
