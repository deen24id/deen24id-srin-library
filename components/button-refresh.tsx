"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ButtonRefresh() {
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" onClick={() => router.refresh()}>
          <IconRefresh />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Refresh current page</TooltipContent>
    </Tooltip>
  );
}
