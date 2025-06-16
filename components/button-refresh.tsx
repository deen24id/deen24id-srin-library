"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";

export function ButtonRefresh() {
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => router.refresh()}>
      <IconRefresh />
      <span className="hidden lg:inline">Refresh the page</span>
    </Button>
  );
}
