import { SeparatorFull } from "@/components/ui/separator";
import { H1 } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <H1>Loading...</H1>
          <SeparatorFull />
        </div>
      </div>
    </div>
  );
}
