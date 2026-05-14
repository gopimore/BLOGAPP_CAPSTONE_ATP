import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="bg-[#1a120b] border-b border-[#3b2a20] sticky top-0 z-50 shadow-lg">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#ddb892] tracking-wide">
            Vintage<span className="italic text-[#f5deb3]">Blog</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-8 text-lg font-medium">
          
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition duration-300 hover:text-[#ddb892] ${
                isActive
                  ? "text-[#ddb892] border-b-2 border-[#ddb892] pb-1"
                  : "text-[#f5deb3]"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              `transition duration-300 hover:text-[#ddb892] ${
                isActive
                  ? "text-[#ddb892] border-b-2 border-[#ddb892] pb-1"
                  : "text-[#f5deb3]"
              }`
            }
          >
            Register
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `transition duration-300 hover:text-[#ddb892] ${
                isActive
                  ? "text-[#ddb892] border-b-2 border-[#ddb892] pb-1"
                  : "text-[#f5deb3]"
              }`
            }
          >
            Login
          </NavLink>
        </nav>

        {/* Right Side Button */}
        <button className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-5 py-2 rounded-full font-semibold transition duration-300 shadow-md">
          Explore
        </button>
      </div>
    </header>
  );
}

export default Header;