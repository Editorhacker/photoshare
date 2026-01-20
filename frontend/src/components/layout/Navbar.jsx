import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      setOpen(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav
      className="
      sticky top-0 z-50 
      bg-[rgba(15,16,20,0.8)] backdrop-blur-[10px]
      border-b border-[var(--border-glass)]
    "
    >
      <div className="px-10 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="text-[1.5rem] font-bold text-[var(--text-main)] 
                     cursor-pointer flex items-center gap-2"
        >
          <span className="text-[var(--primary)]">✦</span> PhotoShare
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-5">
          {!currentUser && (
            <>
              <Link to="/" className="text-[0.95rem] text-[var(--text-main)]">
                Home
              </Link>
              <Link to="/about" className="text-[0.95rem] text-[var(--text-main)]">
                About
              </Link>
              <Button onClick={() => navigate("/login")} className="px-5 py-2">
                Login
              </Button>
            </>
          )}

          {currentUser && (
            <>
              <Link to="/dashboard" className="text-[0.95rem] text-[var(--text-main)]">
                Dashboard
              </Link>

              <span className="w-[1px] h-5 bg-[var(--border-color)]"></span>

              <span className="text-[0.9rem] text-[var(--text-muted)]">
                {currentUser.email}
              </span>

              <Button
                variant="secondary"
                onClick={handleLogout}
                className="px-4 py-2 text-[0.85rem]"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* ======== ANIMATED HAMBURGER BUTTON ======== */}
        <button
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 
                     rounded-lg border border-[var(--border-glass)] 
                     bg-[rgba(255,255,255,0.05)] backdrop-blur-sm relative"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`absolute w-5 h-[2px] bg-[var(--text-main)] rounded-full transition-all duration-300
              ${open ? "rotate-45" : "-translate-y-1.5"}`}
          ></span>

          <span
            className={`absolute w-5 h-[2px] bg-[var(--text-main)] rounded-full transition-all duration-300
              ${open ? "opacity-0" : "opacity-100"}`}
          ></span>

          <span
            className={`absolute w-5 h-[2px] bg-[var(--text-main)] rounded-full transition-all duration-300
              ${open ? "-rotate-45" : "translate-y-1.5"}`}
          ></span>
        </button>
      </div>

      {/* ======== MOBILE MENU ======== */}
      {open && (
        <div
          className="
          md:hidden px-10 py-4 flex flex-col gap-4 
          bg-[rgba(15,16,20,0.95)]
          border-t border-[var(--border-glass)]
        "
        >
          {!currentUser && (
            <>
              <Link to="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link to="/about" onClick={() => setOpen(false)}>
                About
              </Link>
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </Button>
            </>
          )}

          {currentUser && (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </Link>

              <span className="text-[0.9rem] text-[var(--text-muted)]">
                {currentUser.email}
              </span>

              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
