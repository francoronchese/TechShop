import { useMemo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ClipboardList } from "lucide-react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@store/api/apiSlice";
import { PageLoader, PaginationControls } from "@components";

const ITEMS_PER_PAGE = 10;

// Map order status to color classes
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-teal-100 text-teal-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

// Map payment method to color classes
const PAYMENT_METHOD_COLORS = {
  online_payment: "bg-blue-100 text-blue-700",
  cash_on_delivery: "bg-orange-100 text-orange-700",
};

export const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // RTK Query hooks
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  // Sync URL on mount if 'page' param is missing
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Handle status change from dropdown
  const handleStatusChange = async (e, orderId) => {
    // Prevent row click navigation when interacting with the dropdown
    e.stopPropagation();
    const newStatus = e.target.value;
    try {
      await updateOrderStatus({
        _id: orderId,
        orderStatus: newStatus,
      }).unwrap();
      toast.success("Order status updated");
    } catch (error) {
      toast.error(error.data?.message || "Error updating status");
    }
  };

  // Filter orders by search (order ID or customer name/email) and status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !search.trim() ||
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.customerInfo?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.customerInfo?.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // Paginate filtered orders client-side
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, page]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <PageLoader />
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-300">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-slate-800 text-lg font-bold">All Orders</h2>
          <p className="text-sm text-slate-500">
            Manage and update the status of all customer orders
          </p>
        </div>

        {/* Search and filter controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by order ID, name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams({ page: 1 });
            }}
            className="flex-1 p-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-orange-500 transition-all shadow-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setSearchParams({ page: 1 }); // Reset to first page on filter change
            }}
            className="p-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-orange-500 bg-white shadow-sm cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Empty state */}
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ClipboardList className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No orders found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-300">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Payment</th>
                    <th className="pb-3 pr-4">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                      className="cursor-pointer"
                    >
                      {/* Order ID */}
                      <td className="py-3 pr-4 font-mono font-semibold text-slate-700">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      {/* Customer */}
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {order.customerInfo.name || "—"}
                        </p>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {order.customerInfo.email || "—"}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="py-3 pr-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Payment method */}
                      <td className="py-3 pr-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${PAYMENT_METHOD_COLORS[order.paymentMethod]}`}
                        >
                          {order.paymentMethod === "online_payment"
                            ? "Online"
                            : "Cash"}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3 pr-4 font-bold text-orange-600">
                        ${order.total.toFixed(2)}
                      </td>

                      {/* Status dropdown */}
                      <td className="py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(e, order._id)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[order.orderStatus]}`}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden flex flex-col gap-3">
              {paginatedOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                  className="border p-4 border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.customerInfo.name}
                      </p>
                    </div>
                    <p className="font-bold text-orange-600">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PAYMENT_METHOD_COLORS[order.paymentMethod]}`}
                    >
                      {order.paymentMethod === "online_payment"
                        ? "Online"
                        : "Cash"}
                    </span>
                    {/* Stop propagation so clicking dropdown doesn't navigate */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(e, order._id)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[order.orderStatus]}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <PaginationControls
              page={page}
              totalPages={totalPages}
              totalCount={filteredOrders.length}
              onPrev={() => setSearchParams({ page: page - 1 })}
              onNext={() => setSearchParams({ page: page + 1 })}
            />
          </>
        )}
      </div>
    </section>
  );
};
