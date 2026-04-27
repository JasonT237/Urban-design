import { footerGroups } from "../../data/discoverContent";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#E7E8DE]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-slate-600 md:grid-cols-4 md:px-8 lg:px-10">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Urban Sanctuary</h3>
          <p className="mt-3 leading-6">
            Bridging the gap between Douala's vibrant energy and the need for a
            serene booking experience.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {group.title}
            </h4>
            <div className="mt-3 space-y-2">
              {group.links.map((link) => (
                <p key={link}>{link}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
