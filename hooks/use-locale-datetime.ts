"use client";

import { useEffect, useState } from "react";

type Tfunction = (datetime: string) => string;

function useLocaleDatetime(): Tfunction {
  const [locale, setLocale] = useState("en-US");
  useEffect(() => {
    setLocale(window.navigator.language);
  }, []);

  return (datetime: string) =>
    new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(new Date(datetime));
}

export { useLocaleDatetime };
