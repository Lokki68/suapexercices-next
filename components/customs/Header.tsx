"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Ambulance, History, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UsageIndicator from "./UsageIndicator";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

function NavLink({ href, children, icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-red-600 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="w-full bg-transparent text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Ambulance className="h-8 w-8 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold text-red-500 hidden md:inline">
            SUAP Exercices
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink href="/" icon={<Home size={18} />}>
            Accueil
          </NavLink>
          <NavLink href="/historique" icon={<History size={18} />}>
            Historique
          </NavLink>
        </nav>

        <div className="flex items-center gap-4 ">
          <UsageIndicator />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
