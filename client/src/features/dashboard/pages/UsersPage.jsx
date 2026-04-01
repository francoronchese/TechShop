import { useMemo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, ExternalLink } from "lucide-react";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@store/api/apiSlice";
import { PageLoader, PaginationControls, Button } from "@components";

const ITEMS_PER_PAGE = 10;

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

const USER_STATUSES = ["Active", "Inactive", "Suspended"];

export const UsersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const [search, setSearch] = useState("");

  // RTK Query hooks
  const { data: users = [], isLoading } = useGetAllUsersQuery();
  const [updateUserStatus] = useUpdateUserStatusMutation();

  // Sync URL on mount if 'page' param is missing
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Handle status change from dropdown
  const handleStatusChange = async (e, userId) => {
    // Prevent row click navigation when interacting with the dropdown
    e.stopPropagation();
    const newStatus = e.target.value;
    try {
      await updateUserStatus({ _id: userId, status: newStatus }).unwrap();
      toast.success("User status updated");
    } catch (error) {
      toast.error(error.data?.message || "Error updating status");
    }
  };

  // Filter users by search (name or email)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        !search.trim() ||
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  // Paginate filtered users client-side
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

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
          <h2 className="text-slate-800 text-lg font-bold">Users</h2>
          <p className="text-sm text-slate-500">
            Manage and monitor all registered users
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams({ page: 1 });
            }}
            className="w-full max-w-sm p-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-orange-500 transition-all shadow-sm"
          />
        </div>

        {/* Empty state */}
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-300">
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">Joined</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {paginatedUsers.map((user) => (
                    <tr key={user._id}>
                      {/* User info */}
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 line-clamp-1">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Joined date */}
                      <td className="py-3 pr-4 text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Role badge */}
                      <td className="py-3 pr-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[user.role]}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status dropdown */}
                      <td
                        className="py-3 pr-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(e, user._id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_COLORS[user.status]}`}
                        >
                          {USER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* View detail button */}
                      <td className="py-3">
                        <Button
                          onClick={() =>
                            navigate(`/dashboard/users/${user._id}`)
                          }
                          icon={ExternalLink}
                          iconSize={14}
                          className="bg-slate-700 text-white hover:bg-slate-800 text-sm"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden flex flex-col gap-3">
              {paginatedUsers.map((user) => (
                <div
                  key={user._id}
                  className="border border-slate-300 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(e, user._id)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_COLORS[user.status]}`}
                      >
                        {USER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      onClick={() => navigate(`/dashboard/users/${user._id}`)}
                      icon={ExternalLink}
                      iconSize={14}
                      className="bg-slate-700 text-white hover:bg-slate-800 text-sm"
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <PaginationControls
              page={page}
              totalPages={totalPages}
              totalCount={filteredUsers.length}
              onPrev={() => setSearchParams({ page: page - 1 })}
              onNext={() => setSearchParams({ page: page + 1 })}
            />
          </>
        )}
      </div>
    </section>
  );
};
