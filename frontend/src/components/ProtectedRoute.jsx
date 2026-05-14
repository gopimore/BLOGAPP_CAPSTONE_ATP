import { useAuth } from "../store/authStore";
import { Navigate } from "react-router";

function ProtectedRoute({ children, allowedRoles }) {

  // Auth state
  const {
    loading,
    currentUser,
    isAuthenticated,
  } = useAuth();

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a120b] flex items-center justify-center">
        
        <div className="text-center">
          
          <div className="w-16 h-16 border-4 border-[#ddb892] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

          <h1 className="text-3xl font-bold text-[#ddb892] mb-2">
            VintageInk
          </h1>

          <p className="text-[#e6ccb2] tracking-wide">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!isAuthenticated) {

    console.log(
      "ProtectedRoute: not authenticated"
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Normalize role
  const normalizedRole =
    currentUser?.role?.toUpperCase();

  console.log(
    "ProtectedRoute Role:",
    normalizedRole
  );

  // Invalid role
  if (!normalizedRole) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Unauthorized Access
  if (
    allowedRoles &&
    !allowedRoles.includes(
      normalizedRole
    )
  ) {

    console.log(
      "ProtectedRoute: unauthorized"
    );

    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ redirectTo: "/" }}
      />
    );
  }

  // Access Granted
  return (
    <div className="min-h-screen bg-[#1a120b] text-[#f5deb3]">
      
      {/* Vintage Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#ddb892]/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#b08968]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default ProtectedRoute;