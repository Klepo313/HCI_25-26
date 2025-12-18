"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navigation.module.scss";
import { Menu, X } from "lucide-react";

type Page = { title: string; path: `/${string}` };

const pages: Page[] = [
  { title: "Home", path: "/" },
  // { title: "Vehicle Reservation", path: "/vehicle-reservation" },
  { title: "Vehicle List", path: "/vehicle-list" },
  { title: "User Profile", path: "/user" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
  { title: "Login", path: "/login" },
  { title: "Register", path: "/register" },
];

export function Navigation() {
  const currentPath = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simple mobile check (match media)
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [sidebarOpen]);

  return (
    <>
      <div className={styles.navBar} role="navigation" aria-label="Main">
        <div className={styles.inner}>
          <Link href="/" className={`brand-gradient ${styles.brand}`}>
            RentACar
          </Link>
          {isMobile && (
            <button
              className={styles.menuButton}
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
          )}
          {!isMobile && (
            <ul className={styles.links}>
              {pages.map((p) => (
                <li key={p.path} style={{ height: "min-content" }}>
                  <Link
                    href={p.path}
                    className={`${styles.link} ${
                      currentPath === p.path ? styles.active : ""
                    }`}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!isMobile && <ThemeToggle />}
        </div>
      </div>
      {/* Sidebar for mobile */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className={styles.sidebarOverlay}
            onClick={() => setSidebarOpen(false)}
          />
          <nav
            className={`${styles.sidebarDrawer} ${
              sidebarOpen ? styles.sidebarDrawerOpen : ""
            }`}
            aria-label="Sidebar"
          >
            <button
              className={styles.sidebarClose}
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={28} />
            </button>
            <ul className={styles.sidebarLinks}>
              {pages.map((p) => (
                <li key={p.path}>
                  <Link
                    href={p.path}
                    className={currentPath === p.path ? styles.active : ""}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </nav>
        </>
      )}
    </>
  );
}
