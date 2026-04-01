import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, MapPin, ShoppingBag } from "lucide-react";
import {
  useGetOrderByIdQuery,
  useGetOrderByIdAdminQuery,
} from "@store/api/apiSlice";
import { PageLoader, Button } from "@components";

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

// Map payment status to color classes
const PAYMENT_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Get user role from Redux store to determine which endpoint to use
  const role = useSelector((state) => state.user.role);
  const isAdmin = role === "Admin" || role === "SuperAdmin";

  // Use admin endpoint if user is admin, otherwise use user endpoint
  const { data: orderUser, isLoading: loadingUser } = useGetOrderByIdQuery(id, {
    skip: isAdmin,
  });
  const { data: orderAdmin, isLoading: loadingAdmin } =
    useGetOrderByIdAdminQuery(id, {
      skip: !isAdmin,
    });

  const order = isAdmin ? orderAdmin : orderUser;
  const isLoading = isAdmin ? loadingAdmin : loadingUser;

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <PageLoader />
      </div>
    );
  }

  if (!order) {
    return (
      <section className="max-w-7xl mx-auto">
        <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-300">
          <p className="text-slate-500 text-sm text-center py-20">
            Order not found
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-300">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-slate-800 text-lg font-bold">Order Detail</h2>
            <p className="text-sm text-slate-500 font-mono">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <Button
            // Navigate back to the previous page in the browser history
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
            iconSize={16}
            className="w-full sm:w-auto justify-center bg-slate-700 text-white hover:bg-slate-800"
          >
            Back to Orders
          </Button>
        </div>

        {/* Order info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Date */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Date
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Order status */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Order Status
            </p>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.orderStatus]}`}
            >
              {order.orderStatus}
            </span>
          </div>

          {/* Payment method */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Payment Method
            </p>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PAYMENT_METHOD_COLORS[order.paymentMethod]}`}
            >
              {order.paymentMethod === "online_payment"
                ? "Online Payment"
                : "Cash on Delivery"}
            </span>
          </div>

          {/* Payment status */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Payment Status
            </p>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Customer info - only shown to ADMIN */}
        {isAdmin && order.customerInfo.name && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Customer
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {order.customerInfo.name}
            </p>
            <p className="text-sm text-slate-500">{order.customerInfo.email}</p>
          </div>
        )}

        {/* Shipping address */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-orange-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Shipping Address
            </p>
          </div>
          <p className="text-sm text-slate-800">
            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state}, {order.shippingAddress.country}{" "}
            {order.shippingAddress.postal_code}
          </p>
        </div>

        {/* Order items */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={16} className="text-orange-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Items
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-300"
              >
                <div className="flex items-center gap-3">
                  {/* Product image */}
                  {item.product?.image?.[0] && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-300">
                      <img
                        src={item.product.image[0]}
                        alt={item.product.name}
                        className="w-full h-full object-fill"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-orange-600 shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total breakdown */}
        <div className="border-t border-slate-300 pt-4">
          <div className="flex justify-end mb-2">
            <div className="flex items-center justify-between gap-8 w-full sm:w-64">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-sm font-semibold text-slate-800">
                ${(order.total - order.shippingCost).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex justify-end mb-4">
            <div className="flex items-center justify-between gap-8 w-full sm:w-64">
              <span className="text-sm text-slate-500">Shipping</span>
              <span className="text-sm font-semibold text-green-600">
                {order.shippingCost === 0
                  ? "FREE"
                  : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>
          </div>
          <div className="flex justify-end border-t border-slate-300 pt-4">
            <div className="flex items-center justify-between gap-8 w-full sm:w-64">
              <span className="font-bold text-slate-800">Total</span>
              <span className="text-xl font-black text-orange-600">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
