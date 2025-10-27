"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Page = {
  title: string;
  path: `/${string}`;
};

/**
 * pages is an array of objects representing the pages in the web app.
 * Each object contains a title and a path. This array is used to generate the navigation menu.
 *
 * We hardcode pages here, but in real app you want to store and read this information from some external source (e.g. CMS, DB, config file, etc).
 */
const pages: Page[] = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Vehicle Reservation",
    path: "/vehicle-reservation",
  },
  {
    title: "Vehicle List",
    path: "/vehicle-list",
  },
  {
    title: "User Profile",
    path: "/user",
  },
  {
    title: "About us",
    path: "/about",
  },
  {
    title: "Contact us",
    path: "/contact",
  },
  {
    title: "Login",
    path: "/login",
  },
  {
    title: "Register",
    path: "/register",
  },
];

/**
 * Render a page list item.
 * @param page - { title, path } for the page
 * @param index - array index used for key
 * @returns JSX element for a list item
 */
function processPage(page: Page, index: number, currentPath?: string) {
  return (
    <li key={index}>
      <Link
        href={page.path}
        className={currentPath === page.path ? "font-extrabold" : ""}
      >
        {page.title}
      </Link>
    </li>
  );
}

export function Navigation() {
  const currentPath = usePathname();
  return (
    <nav>
      <ul className="flex space-x-4 mb-4">
        {pages.map((page, index) => processPage(page, index, currentPath))}
      </ul>
    </nav>
  );
}
