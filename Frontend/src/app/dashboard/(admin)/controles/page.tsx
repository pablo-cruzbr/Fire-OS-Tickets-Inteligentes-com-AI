import Link from "next/link";
import { TbChevronRight } from "react-icons/tb";
import { PageHeader } from "@/components/ui";
import { navigation, type NavLink } from "@/components/layout/navigation";
import { useT } from "@/i18n/text";

const controles: NavLink[] =
  navigation.flatMap((section) => section.items).find((item) => item.children?.some((child) => child.href === "/dashboard/controles/equipamentos"))?.children ?? [];

export default function ControlesPage() {
  const t = useT();
  const title = t({ pt: "Controles", en: "Controls" });
  return (
    <section>
      <PageHeader title={title} breadcrumbs={[{ label: t({ pt: "Painel", en: "Dashboard" }), href: "/dashboard" }, { label: title }]} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {controles.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center justify-between rounded-xl bg-card p-5 shadow-md transition-colors hover:bg-lightprimary"
          >
            <span className="font-semibold text-link group-hover:text-primarytext">{t(link.label)}</span>
            <TbChevronRight className="h-5 w-5 text-muted group-hover:text-primarytext" />
          </Link>
        ))}
      </div>
    </section>
  );
}
