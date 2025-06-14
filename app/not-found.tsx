import { SeparatorFull } from "@/components/ui/separator";
import { H1, P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <H1>404 - Page Not Found.</H1>
          <SeparatorFull />
          <P>The page you are looking for does not exist.</P>
        </div>
      </div>
    </div>
  );
}
