import { useMemo, useEffect } from "react";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { useGetOrdersQuery } from "@store/api/apiSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageLoader, PaginationControls, Button } from "@components";

const ITEMS_PER_PAGE = 10;

// Map order status to color classes
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-teal-100 text-teal-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// Map payment method to color classes
const PAYMENT_METHOD_COLORS = {
  online_payment: "bg-blue-100 text-blue-700",
  cash_on_delivery: "bg-orange-100 text-orange-700",
};

export const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const navigate = useNavigate();

  // RTK Query hook to fetch user orders
  const { data: orders = [], isLoading } = useGetOrdersQuery();

  // Sync URL on mount if 'page' param is missing
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Paginate orders client-side
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return orders.slice(start, start + ITEMS_PER_PAGE);
  }, [orders, page]);

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
          <h2 className="text-slate-800 text-lg font-bold">My Orders</h2>
          <p className="text-sm text-slate-500">Track and manage your orders</p>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No orders yet</p>
          </div>
        ) : (
          <>
            {/* Orders list */}
            <div className="flex flex-col gap-4">
              {paginatedOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-slate-300 rounded-xl overflow-hidden"
                >
                  {/* Order summary row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3">
                    {/* Left side - order info */}
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-bold font-mono text-slate-800">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Right side - badges, total and view button */}
                    <div className="flex flex-row flex-wrap items-center gap-3">
                      {/* Order status badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                      {/* Payment method badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PAYMENT_METHOD_COLORS[order.paymentMethod]}`}>
                        {order.paymentMethod === "online_payment" ? "Online Payment" : "Cash on Delivery"}
                      </span>
                      {/* Total */}
                      <p className="text-lg font-bold text-orange-600">
                        ${order.total.toFixed(2)}
                      </p>
                      {/* View detail button */}
                      <Button
                        onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                        icon={ExternalLink}
                        iconSize={14}
                        className="bg-slate-700 text-white hover:bg-slate-800 text-sm"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <PaginationControls
              page={page}
              totalPages={totalPages}
              totalCount={orders.length}
              onPrev={() => setSearchParams({ page: page - 1 })}
              onNext={() => setSearchParams({ page: page + 1 })}
            />
          </>
        )}
      </div>
    </section>
  );
};