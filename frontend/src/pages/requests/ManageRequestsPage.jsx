import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/layout/Sidebar";
import {
  fetchRequisitions,
  approveRequisition,
  rejectRequisition,
  dispatchRequisition,
} from "../../api/endpoints/requisitions";

const STATUS_STYLES = {
  pending: "bg-[#FBF3E0] text-[#9A6E1F]",
  approved: "bg-[#E7F3EC] text-[#2F7A54]",
  rejected: "bg-[#FBEDE6] text-[#B23B1E]",
  dispatched: "bg-[#EAF0FB] text-[#3457A6]",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || ""}`}
    >
      {status}
    </span>
  );
}

export default function ManageRequestsPage() {
  const [requisitions, setRequisitions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

  const loadRequisitions = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetchRequisitions({
        status: statusFilter || undefined,
      });
      setRequisitions(response.data.data);
    } catch {
      setError(
        "Could not load requests. Check that the backend server is running.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadRequisitions();
  }, [loadRequisitions]);

  async function handleApprove(req) {
    setActioningId(req.id);
    try {
      await approveRequisition(req.id);
      loadRequisitions();
    } catch (err) {
      alert(err.response?.data?.message || "Could not approve this request.");
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(req) {
    const comment = window.prompt("Reason for rejecting this request:");
    if (!comment) return; // cancelled or empty — backend requires a comment anyway

    setActioningId(req.id);
    try {
      await rejectRequisition(req.id, { admin_comment: comment });
      loadRequisitions();
    } catch (err) {
      alert(err.response?.data?.message || "Could not reject this request.");
    } finally {
      setActioningId(null);
    }
  }

  async function handleDispatch(req) {
    setActioningId(req.id);
    try {
      await dispatchRequisition(req.id);
      loadRequisitions();
    } catch (err) {
      alert(err.response?.data?.message || "Could not dispatch this request.");
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#EDEEF0]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 md:px-12">
        <div className="max-w-4xl">
          <p className="text-xs tracking-[0.1em] text-[#8891A3] uppercase">
            Requests
          </p>
          <h1 className="mt-1 font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
            Manage Requests
          </h1>

          <div className="mt-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-[8px] border border-[#D5D8DD] bg-white px-3.5 py-2.5 text-sm text-[#10182B] outline-none focus:border-[#C99A4B]"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="dispatched">Dispatched</option>
            </select>
          </div>

          <section className="mt-6 bg-white rounded-[10px] border border-[#E2E4E8] overflow-hidden">
            {error && (
              <div className="px-5 py-3 text-sm text-[#B23B1E] bg-[#FBEDE6] border-b border-[#E4B8A0]">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="py-14 text-center text-sm text-[#8891A3]">
                Loading…
              </div>
            ) : requisitions.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-[15px] font-medium text-[#10182B]">
                  No requests found
                </p>
                <p className="mt-1 text-sm text-[#5B6472]">
                  Requests submitted by employees will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#5B6472] border-b border-[#E2E4E8]">
                    <th className="px-5 py-3 font-medium">Employee</th>
                    <th className="px-5 py-3 font-medium">Justification</th>
                    <th className="px-5 py-3 font-medium">Qty</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {requisitions.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-[#E2E4E8] last:border-0"
                    >
                      <td className="px-5 py-3 text-[#10182B]">
                        {req.user?.name}
                      </td>
                      <td className="px-5 py-3 text-[#5B6472] max-w-xs truncate">
                        {req.justification}
                      </td>
                      <td className="px-5 py-3 text-[#5B6472]">
                        {req.quantity}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                        {req.status === "pending" && (
                          <>
                            <button
                              disabled={actioningId === req.id}
                              onClick={() => handleApprove(req)}
                              className="text-[#2F7A54] hover:underline text-sm disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              disabled={actioningId === req.id}
                              onClick={() => handleReject(req)}
                              className="text-[#B23B1E] hover:underline text-sm disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === "approved" && (
                          <button
                            disabled={actioningId === req.id}
                            onClick={() => handleDispatch(req)}
                            className="text-[#3457A6] hover:underline text-sm disabled:opacity-50"
                          >
                            Mark Dispatched
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
