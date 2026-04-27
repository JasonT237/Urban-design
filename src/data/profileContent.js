export const profileFields = [
  {
    label: "Full Name",
    type: "text",
    defaultValue: "Jean-Luc Ebene",
  },
  {
    label: "Email Address",
    type: "email",
    defaultValue: "jean.luc@example.com",
  },
  {
    label: "Phone Number",
    type: "text",
    defaultValue: "+237 670 000 000",
  },
];

export const languageOptions = ["English", "French"];

export const securitySettings = [
  {
    title: "Password",
    description: "Last changed 3 months ago",
    action: "Change Password",
  },
  {
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account.",
    enabled: true,
  },
];

export const notificationSettings = [
  {
    title: "Email Notifications",
    description: "Receive booking updates and confirmations by email.",
    enabled: true,
  },
  {
    title: "SMS Alerts",
    description: "Get stay reminders and important alerts on your phone.",
    enabled: false,
  },
];
