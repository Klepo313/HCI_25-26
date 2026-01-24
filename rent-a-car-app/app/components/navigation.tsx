"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "./AuthProvider";
import styles from "./Navigation.module.scss";
import { Menu, X } from "lucide-react";

type Page = { title: string; path: `/${string}` };

const pages: Page[] = [
  { title: "Home", path: "/" },
  // { title: "Vehicle Reservation", path: "/vehicle-reservation" },
  { title: "Vehicle List", path: "/vehicle-list" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
  { title: "User Profile", path: "/user" },
  { title: "Login", path: "/login" },
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

  const { user, logout } = useAuth();

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
              {pages
                .filter((p) => !(p.path === "/login" && user))
                .map((p) => (
                  <li key={p.path} style={{ height: "min-content" }}>
                    <Link
                      href={p.path}
                      className={`${styles.link} ${
                        currentPath === p.path ? styles.active : ""
                      } ${p.path === "/login" ? styles.loginCta : ""}`}
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}

              {user && (
                <li style={{ height: "min-content" }}>
                  <button
                    onClick={() => logout()}
                    className={`${styles.link} ${styles.loginCta}`}
                    style={{ background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    Logout
                  </button>
                </li>
              )}
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
              {pages
                .filter((p) => !(p.path === "/login" && user))
                .map((p) => (
                  <li key={p.path}>
                    <Link
                      href={p.path}
                      className={`${currentPath === p.path ? styles.active : ""} ${p.path === "/login" ? "" : ""}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}

              {user && (
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setSidebarOpen(false);
                    }}
                    className={styles.link}
                    style={{ background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
            <ThemeToggle />
          </nav>
        </>
      )}
    </>
  );
}
