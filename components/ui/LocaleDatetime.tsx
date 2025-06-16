"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

type TDatetimeLocale = {
  datetime: string;
};

function LocaleDatetime(props: TDatetimeLocale) {
  const [locale, setLocale] = useState("en-US");
  useEffect(() => {
    setLocale(window.navigator.language);
  }, []);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(new Date(props.datetime));
}

export default dynamic(() => Promise.resolve(LocaleDatetime), {
  ssr: false,
});
