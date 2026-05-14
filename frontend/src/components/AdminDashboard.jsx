import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function AdminDashboard() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { currentUser, logout, isAuthenticated, loading } =
    useAuth();

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Auth Check
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);

      const response = await axios.get(
        `${BASE_URL}/admin-api/users`,
        {
          withCredentials: true,
        }
      );

      setUsers(response.data.payload);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  }, [BASE_URL]);

  // Admin Check
  useEffect(() => {
    if (
      !loading &&
      isAuthenticated &&
      currentUser?.role === "ADMIN"
    ) {
      fetchUsers();
    } else if (
      !loading &&
      isAuthenticated &&
      currentUser?.role !== "ADMIN"
    ) {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, currentUser, loading, navigate, fetchUsers]);

  // Block/Unblock
  const toggleBlockUser = async (
    userId,
    isCurrentlyBlocked
  ) => {
    try {
      setActionLoading(userId);

      const action = isCurrentlyBlocked
        ? "unblock"
        : "block";

      await axios.put(
        `${BASE_URL}/admin-api/${action}/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success(`User ${action}ed successfully`);

      fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error(
        `Failed to ${
          isCurrentlyBlocked ? "unblock" : "block"
        } user`
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Delete User
  const softDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(userId);

      await axios.delete(
        `${BASE_URL}/admin-api/users/${userId}`,
        {
          withCredentials: true,
        }
      );

      toast.success("User deleted successfully");

      fetchUsers();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a120b] flex justify-center items-center text-[#f5deb3] text-3xl font-bold">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (currentUser?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-[#1a120b] text-[#f5deb3] px-6 py-10">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        
        {/* Admin Profile */}
        <div className="flex items-center gap-5">
          
          {currentUser.profileImageUrl && (
            <img
              src={currentUser.profileImageUrl}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#ddb892]"
            />
          )}

          <div>
            <p className="uppercase tracking-[0.3em] text-[#ddb892] text-sm mb-2">
              Vintage Admin Panel
            </p>

            <h1 className="text-4xl font-bold">
              {currentUser.firstName}{" "}
              {currentUser.lastName}
            </h1>

            <p className="text-[#e6ccb2] mt-1">
              {currentUser.email}
            </p>

            <span className="inline-block mt-3 bg-[#ddb892] text-black px-4 py-1 rounded-full text-sm font-semibold">
              Administrator
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* User Table Card */}
      <div className="max-w-7xl mx-auto bg-[#2d1e16] border border-[#4a3728] rounded-3xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          
          <div>
            <h2 className="text-3xl font-bold text-[#ddb892]">
              User Management
            </h2>

            <p className="text-[#e6ccb2] mt-2">
              Manage authors and users across the platform.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-6 py-3 rounded-full font-semibold transition duration-300"
            disabled={loadingUsers}
          >
            {loadingUsers ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Table */}
        {loadingUsers ? (
          <div className="text-center py-16 text-2xl text-[#ddb892]">
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#4a3728]">
            
            <table className="min-w-full">
              
              <thead className="bg-[#3b2a20] text-[#ddb892]">
                <tr>
                  <th className="px-6 py-4 text-left">
                    User
                  </th>

                  <th className="px-6 py-4 text-left">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-[#4a3728] hover:bg-[#35241b] transition duration-200"
                  >
                    
                    {/* User */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        
                        {user.profileImageUrl && (
                          <img
                            src={user.profileImageUrl}
                            alt="profile"
                            className="w-12 h-12 rounded-full object-cover border border-[#ddb892]"
                          />
                        )}

                        <div>
                          <p className="font-semibold">
                            {user.firstName}{" "}
                            {user.lastName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5 text-[#e6ccb2]">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-blue-500/20 text-blue-300"
                            : user.role === "AUTHOR"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          user.isActive
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {user.isActive
                          ? "Active"
                          : "Blocked"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex gap-3 flex-wrap">
                        
                        <button
                          onClick={() =>
                            toggleBlockUser(
                              user._id,
                              !user.isActive
                            )
                          }
                          className={`px-5 py-2 rounded-full text-sm font-semibold transition duration-300 ${
                            user.isActive
                              ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                          disabled={
                            actionLoading === user._id
                          }
                        >
                          {actionLoading === user._id
                            ? "..."
                            : user.isActive
                            ? "Block"
                            : "Unblock"}
                        </button>

                        <button
                          onClick={() =>
                            softDeleteUser(user._id)
                          }
                          className="px-5 py-2 rounded-full text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition duration-300"
                          disabled={
                            actionLoading === user._id
                          }
                        >
                          {actionLoading === user._id
                            ? "..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;