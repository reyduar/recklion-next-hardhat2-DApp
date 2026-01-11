"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar } from "@heroui/react";
import { PiWalletBold } from "react-icons/pi";
import { HiOutlineCubeTransparent } from "react-icons/hi2";
import { MdOutlineHowToVote } from "react-icons/md";
import { useAccount } from "wagmi";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    name: "Wallet",
    href: "/",
    icon: PiWalletBold,
  },
  {
    name: "DeFi",
    href: "/defi",
    icon: HiOutlineCubeTransparent,
  },
  {
    name: "Lottery",
    href: "/lottery",
    icon: MdOutlineHowToVote,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[88px] border-r border-[#383838] bg-[#202222] flex flex-col items-center py-5">
      {/* Logo Section */}
      <div className="mb-6">
        <Link href="/defi/dashboard" className="block">
          <Image
            src="/logo.png"
            alt="Logo"
            width={56}
            height={56}
            className="rounded-lg"
          />
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 w-full px-2 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg
                text-[10px] font-medium transition-colors duration-150
                ${
                  isActive
                    ? "bg-[#2f2f2f] text-white"
                    : "text-gray-500 hover:text-gray-300"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Account Section */}
      <div className="w-full px-2 pb-2">
        <Link
          href="/admin"
          className="flex flex-col items-center gap-1.5 py-3 rounded-lg hover:text-gray-300 transition-colors cursor-pointer"
        >
          <Avatar
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            size="sm"
            className="w-9 h-9"
          />
          <div className="text-center w-full">
            <p
              className="text-[10px] font-medium text-gray-500 truncate px-1"
              suppressHydrationWarning
            >
              {isConnected && address ? "Admin" : "Account"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
