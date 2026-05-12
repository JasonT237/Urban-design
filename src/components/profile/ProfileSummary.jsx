function getFullName(user) {
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  return fullName || user?.email || user?.phone || "Your profile";
}

function getInitials(user) {
  const nameParts = [user?.first_name, user?.last_name].filter(Boolean);

  if (nameParts.length) {
    return nameParts.map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  }

  return (user?.email || "U").slice(0, 1).toUpperCase();
}

function formatMemberSince(createdAt) {
  if (!createdAt) {
    return "Member since account creation";
  }

  return `Member since ${new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt))}`;
}

function formatRole(role) {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : "Guest";
}

export default function ProfileSummary({ user, onEditProfile }) {
  const fullName = getFullName(user);
  const initials = getInitials(user);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#E7E8DE] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={fullName}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-[#F3E3D3]"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-sky-900 text-4xl font-semibold text-white ring-4 ring-[#F3E3D3]">
                {initials}
              </div>
            )}
            <button
              className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-sky-900 text-sm font-semibold text-white shadow-md transition hover:bg-sky-800"
              onClick={onEditProfile}
              type="button"
            >
              Edit
            </button>
          </div>

          <h2 className="mt-6 text-3xl font-semibold text-sky-900">
            {fullName}
          </h2>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            {formatMemberSince(user?.created_at)}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {[
            user?.is_verified ? "Verified Identity" : "Identity not verified",
            user?.email || "No email added",
            user?.phone || "No phone added",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl bg-[#F7F8F0] px-4 py-4 text-slate-700"
            >
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] bg-sky-900 p-6 text-white shadow-sm">
        <p className="text-lg font-semibold">{formatRole(user?.role)} Account</p>
        <p className="mt-3 text-sm leading-6 text-sky-100">
          {user?.loyalty_points ?? 0} loyalty points available on this account.
        </p>
      </div>
    </div>
  );
}
