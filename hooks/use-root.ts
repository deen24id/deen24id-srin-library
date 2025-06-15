"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * Get root path of nextJS's pathame.
 */
function rootPath(path: string): string {
  if (path === "/") {
    return "/";
  } else {
    return "/" + path.split("/")[1];
  }
}

/**
 * Get text of a given root path.
 */
function rootText(root: string): string {
  let out;

  if (root === "/") {
    out = "";
  } else {
    out = root
      .slice(1)
      .split("-")
      .map((val) => val[0].toUpperCase() + val.slice(1))
      .join(" ");
  }

  return out;
}

function useRootPath() {
  const [activePath, setActivePath] = useState("/");
  const pathname = usePathname();

  useEffect(() => {
    setActivePath(rootPath(pathname));
  }, [pathname]);

  return activePath;
}

function useRootText() {
  const [activeText, setActiveText] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setActiveText(rootText(rootPath(pathname)));
  }, [pathname]);

  return activeText;
}

function RootPath() {
  return useRootPath();
}

function RootText() {
  return useRootText();
}

export { useRootPath, useRootText, RootText, RootPath };
