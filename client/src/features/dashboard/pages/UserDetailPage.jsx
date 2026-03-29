import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, ShoppingBag, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
} from "@store/api/apiSlice";
import { PageLoader, Button } from "@components";

// Map order status to color classes
const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-teal-100 text-teal-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// Map user status to color classes
const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-slate-100 text-slate-700",
  Suspended: "bg-red-100 text-red-700",
};

// Map user role to color classes
const ROLE_COLORS = {
  SuperAdmin: "bg-purple-100 text-purple-700",
  Admin: "bg-blue-100 text-blue-700",
  User: "bg-slate-100 text-slate-600",
};

const USER_ROLES = ["SuperAdmin", "Admin", "User"];

export const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Get current user role from Redux to determine if role change is allowed
  // Only SuperAdmin can change roles
  const isSuperAdmin = useSelector((state) => state.user.role) === "SuperAdmin";

  // RTK Query hooks
  const { data: user, isLoading } = useGetUserByIdQuery(id);
  const [updateUserRole] = useUpdateUserRoleMutation();

  // Handle role change - only available to SuperAdmin
  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    try {
      await updateUserRole({ _id: id, role: newRole }).unwrap();
      toast.success("User role updated");
    } catch (error) {
      toast.error(error.data?.message || "Error updating role");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <PageLoader />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="max-w-7xl mx-auto">
        <div className="p-6 mt-6 lg:mt-0 bg-white rounded-xl shadow-sm border border-slate-300">
          <p className="text-slate-500 text-sm text-center py-20">
            User not found
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
            <h2 className="text-slate-800 text-lg font-bold">User Detail</h2>
          </div>
          <Button
            // Navigate back to the previous page in the browser history
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
            iconSize={16}
            className="w-full sm:w-auto justify-center bg-slate-700 text-white hover:bg-slate-800"
          >
            Back to Users
          </Button>
        </div>

        {/* User profile */}
        <div className="flex flex-col sm:flex-row items-start gap-6 p-4 mb-6 rounded-xl border border-slate-300">
          {/* Avatar */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover shrink-0 border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-teal-500 text-white flex items-center justify-center text-2xl font-bold shrink-0 border-4 border-white shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[user.status]}`}
              >
                {user.status}
              </span>
            </div>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="text-sm text-slate-500">
              Phone: {user.mobile || "Null"}
            </p>
            <p className="text-xs text-slate-400">
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {/* Role - dropdown for SuperAdmin, badge for others */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Role:
              </span>
              {isSuperAdmin ? (
                <select
                  value={user.role}
                  onChange={handleRoleChange}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${ROLE_COLORS[user.role]}`}
                >
                  {USER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[user.role]}`}
                >
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Addresses */}
        {user.addresses && user.addresses.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-orange-500" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Addresses ({user.addresses.length})
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="p-4 rounded-xl border border-slate-300"
                >
                  <p className="text-sm font-semibold text-slate-800">
                    {addr.address}
                  </p>
                  <p className="text-sm text-slate-500">
                    {addr.city}, {addr.state}, {addr.country} {addr.postal_code}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={16} className="text-orange-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Orders ({user.orders?.length || 0})
            </p>
          </div>

          {!user.orders || user.orders.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-400 text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {user.orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-slate-300 rounded-xl cursor-pointer"
                >
                  {/* Order ID and date */}
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-slate-800 font-mono">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Status and total */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ORDER_STATUS_COLORS[order.orderStatus]}`}
                    >
                      {order.orderStatus}
                    </span>
                    <p className="text-lg font-bold text-orange-600">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
