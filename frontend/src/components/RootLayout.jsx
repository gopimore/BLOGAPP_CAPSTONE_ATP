import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";

function RootLayout() {

  const checkAuth = useAuth(
    (state) => state.checkAuth
  );

  const isAuthenticated = useAuth(
    (state) => state.isAuthenticated
  );

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  // Check Authentication
  useEffect(() => {
    if (
      !isAuthenticated ||
      !currentUser
    ) {
      checkAuth();
    }
  }, [
    checkAuth,
    isAuthenticated,
    currentUser,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a120b] text-[#f5deb3] overflow-x-hidden">
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default RootLayout;