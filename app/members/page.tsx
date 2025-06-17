import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
  Table,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { member, stats } from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { TableCellViewer } from "./component";
import { eq, desc, or, sum } from "drizzle-orm";
import { ButtonRefresh } from "@/components/button-refresh";
import LocaleDatetime from "@/components/ui/LocaleDatetime";
import { buttonVariants } from "@/components/ui/button";
import {
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const db = drizzle(process.env.DATABASE_URL!);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsData = await searchParams;

  if (
    typeof searchParamsData["page"] !== "string" ||
    isNaN(parseInt(searchParamsData["page"])) ||
    parseInt(searchParamsData["page"]) <= 0
  ) {
    redirect("/members?page=1");
  }

  const pageNumber = parseInt(searchParamsData["page"]);

  if (pageNumber != parseFloat(searchParamsData["page"])) {
    redirect("/members?page=" + pageNumber);
  }

  const statsData = await db
    .select({ value: sum(stats.amount) })
    .from(stats)
    .where(
      or(
        eq(stats.name, "member-total-CREATED"),
        eq(stats.name, "member-total-UPDATED")
      )
    );

  const totalEntries = parseInt(statsData[0].value ?? "0");
  const totalPage = Math.ceil(totalEntries / 10);

  if (pageNumber > totalPage) {
    redirect("/members?page=" + totalPage);
  }

  const memberData = await db
    .select()
    .from(member)
    .where(or(eq(member.status, "CREATED"), eq(member.status, "UPDATED")))
    .orderBy(desc(member.lastUpdatedAt))
    .limit(10)
    .offset((pageNumber - 1) * 10);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-end px-4 lg:px-6 gap-2">
            <ButtonRefresh />
            <TableCellViewer
              variant="create"
              name=""
              id={""}
              status={null}
              email={""}
              phone={""}
              country={null}
              city={null}
              lastUpdatedAt={""}
            />
          </div>
          <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
          >
            <TabsContent
              value="outline"
              className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted sticky top-0 z-10">
                    <TableRow className="w-full">
                      <TableHead></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Last Updated At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberData.map((val) => (
                      <TableRow key={val.id}>
                        <TableCell>
                          <div className="flex gap-1">
                            <TableCellViewer variant="edit" {...val} />
                            <TableCellViewer variant="delete" {...val} />
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {val.name}
                        </TableCell>
                        <TableCell>{val.email}</TableCell>
                        <TableCell>{val.phone}</TableCell>
                        <TableCell>{val.country}</TableCell>
                        <TableCell>{val.city}</TableCell>
                        <TableCell>
                          {<LocaleDatetime datetime={val.lastUpdatedAt} />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col-reverse gap-2 lg:flex-row items-center justif-center lg:justify-between">
                <div className="text-sm lg:flex">
                  Displaying {(pageNumber - 1) * 10 + 1}-
                  {(pageNumber - 1) * 10 + memberData.length} of {totalEntries}{" "}
                  entries.
                </div>
                <div className="w-full items-center gap-8 lg:w-fit">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/members?page=${pageNumber - 10}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "icon" }),
                        pageNumber <= 10 && "pointer-events-none opacity-50"
                      )}
                    >
                      <IconChevronsLeft />
                    </Link>
                    <Link
                      href={`/members?page=${pageNumber - 1}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "icon" }),
                        pageNumber <= 1 && "pointer-events-none opacity-50"
                      )}
                    >
                      <IconChevronLeft />
                    </Link>
                    <Link
                      href={`/members?page=${pageNumber + 1}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "icon" }),
                        pageNumber >= totalPage &&
                          "pointer-events-none opacity-50"
                      )}
                    >
                      <IconChevronRight />
                    </Link>
                    <Link
                      href={`/members?page=${pageNumber + 10}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "icon" }),
                        pageNumber >= totalPage - 9 &&
                          "pointer-events-none opacity-50"
                      )}
                    >
                      <IconChevronsRight />
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
