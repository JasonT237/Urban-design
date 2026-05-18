/** UI labels for API roles (swagger: guest | homeowner | admin) */
export const ADMIN_API_ROLES = ["admin", "homeowner", "guest"];

export const ADMIN_ROLE_META = {
  admin: {
    label: "Super Admin",
    subtitle: "System Owner",
    description: "Full access to all modules, users, and configuration.",
  },
  homeowner: {
    label: "Property Manager",
    subtitle: "Listings & bookings",
    description: "Manage listings, view payments, and handle reservations.",
  },
  guest: {
    label: "Support Agent",
    subtitle: "Guest support",
    description: "Handle inquiries, tickets, and day-to-day guest support.",
  },
};

export const DEFAULT_PERMISSION_MODULES = [
  {
    module: "users",
    label: "Users",
    description: "Staff and tenant accounts",
  },
  {
    module: "payments",
    label: "Payments",
    description: "Transactions and invoicing",
  },
  {
    module: "listings",
    label: "Listings",
    description: "Property details and availability",
  },
  {
    module: "bookings",
    label: "Bookings",
    description: "Reservations lifecycle",
  },
  {
    module: "tickets",
    label: "Support tickets",
    description: "Customer support queue",
  },
];
