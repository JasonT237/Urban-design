import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthToken } from "../hooks/useAuthToken";

const navLinks = [
  { label: "Discover", to: "/discover", activeKey: "discover" },
  { label: "Neighborhoods", to: "/apartments", activeKey: "apartments" },
  { label: "Reservations", to: "/history", activeKey: "reservations" },
  { label: "Support", to: "/support", activeKey: "support" },
];

const publicNavLinks = [
  { label: "Discover", to: "/", activeKey: "discover" },
];

const userLinks = [
  { label: "Profile", to: "/profile" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Booking History", to: "/history" },
];

const adminUserLinks = [
  { label: "Admin Console", to: "/admin" },
  ...userLinks,
];

function isRouteActive(path, type) {
  switch (type) {
    case "discover":
      return path === "/" || path === "/discover";
    case "apartments":
      return path.startsWith("/apartments");
    case "reservations":
      return ["/history", "/booking", "/payment", "/success"].some((route) =>
        path.startsWith(route),
      );
    case "support":
      return path.startsWith("/support");
    case "user":
      return ["/login", "/register", "/dashboard", "/profile", "/admin"].some(
        (route) => path.startsWith(route),
      );
    default:
      return false;
  }
}

function DesktopNavLink({ link, active }) {
  return (
    <Link
      to={link.to}
      className="group relative inline-flex cursor-pointer items-center justify-center text-[11px] uppercase tracking-[0.18em]"
    >
      <span
        className={`transition-all duration-200 ${
          active
            ? "font-semibold text-sky-900"
            : "text-slate-500 group-hover:text-sky-900 group-hover:scale-[1.04]"
        }`}
      >
        {link.label}
      </span>
      <span
        className={`absolute -bottom-2 left-0 h-[2px] rounded-full bg-sky-900 transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}

function MobileNavLink({ link, active, onClick }) {
  return (
    <Link
      to={link.to}
      className={`text-[11px] uppercase tracking-[0.18em] transition ${
        active ? "font-semibold text-sky-900" : "text-slate-500 hover:text-sky-900"
      }`}
      onClick={onClick}
    >
      {link.label}
    </Link>
  );
}

function DropdownLink({ link, currentPath, onClick }) {
  const active = currentPath === link.to;

  return (
    <Link
      to={link.to}
      className={`block rounded-lg px-4 py-2 text-sm transition ${
        active
          ? "bg-sky-50 font-medium text-sky-900"
          : "text-slate-600 hover:bg-slate-50 hover:text-sky-900"
      }`}
      onClick={onClick}
    >
      {link.label}
    </Link>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, clearToken, role } = useAuthToken();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const visibleNavLinks = isAuthenticated ? navLinks : publicNavLinks;
  const accountLinks = role === "admin" ? adminUserLinks : userLinks;

  const closeMenu = () => setMenuOpen(false);
  const closeProfile = () => setProfileOpen(false);
  const isActive = (type) => isRouteActive(pathname, type);
  const handleLogout = () => {
    clearToken();
    closeMenu();
    closeProfile();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7E8DE] bg-[#F7F8F0]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8 lg:px-10">
        <Link
          to={isAuthenticated ? "/discover" : "/"}
          className="text-[15px] font-semibold tracking-tight text-sky-900 transition hover:opacity-90"
        >
          Urban Sanctuary
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {visibleNavLinks.map((link) => (
            <DesktopNavLink
              key={link.to}
              link={link}
              active={isActive(link.activeKey)}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <Link
              to="/login"
              className="hidden rounded-full bg-sky-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 md:inline-flex"
            >
              Login
            </Link>
          )}

          {isAuthenticated && (
          <div className="relative hidden md:block">
            <button
              onClick={() => setProfileOpen((previous) => !previous)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border bg-white transition duration-200 hover:-translate-y-[1px] hover:bg-slate-50 hover:shadow-sm ${
                isActive("user")
                  ? "border-sky-200 text-sky-900"
                  : "border-[#E7E8DE] text-slate-600"
              }`}
              aria-label="User menu"
              type="button"
            >
              U
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-[#E7E8DE] bg-white p-2 shadow-lg">
                {accountLinks.map((link) => (
                  <DropdownLink
                    key={link.to}
                    link={link}
                    currentPath={pathname}
                    onClick={closeProfile}
                  />
                ))}
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => setMenuOpen((previous) => !previous)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E8DE] bg-white text-slate-600 transition duration-200 hover:-translate-y-[1px] hover:bg-slate-50 hover:shadow-sm md:hidden"
              aria-label="Open menu"
              type="button"
            >
              Menu
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-sky-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 md:hidden"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {menuOpen && isAuthenticated && (
        <div className="border-t border-[#E7E8DE] bg-[#F7F8F0] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {visibleNavLinks.map((link) => (
              <MobileNavLink
                key={link.to}
                link={link}
                active={isActive(link.activeKey)}
                onClick={closeMenu}
              />
            ))}

            <div className="mt-2 border-t border-[#E7E8DE] pt-4">
              <div className="mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                User Portal
              </div>

              <div className="flex flex-col gap-3">
                {accountLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-slate-600 transition hover:text-sky-900"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-left text-sm text-red-600 transition hover:text-red-700"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
