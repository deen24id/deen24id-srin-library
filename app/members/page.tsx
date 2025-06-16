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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import {
  IconChevronsLeft,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsRight,
} from "@tabler/icons-react";
import { table } from "console";
import { Label } from "recharts";

const db = drizzle(process.env.DATABASE_URL!);

export default async function Page() {
  const memberData = await db
    .select()
    .from(member)
    .where(or(eq(member.status, "CREATED"), eq(member.status, "UPDATED")))
    .orderBy(desc(member.lastUpdatedAt))
    .limit(10);

  const totalRows = await db
    .select({ value: sum(stats.amount) })
    .from(stats)
    .where(
      or(
        eq(stats.name, "member-total-CREATED"),
        eq(stats.name, "member-total-UPDATED")
      )
    );

  console.log(totalRows[0].value);

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
                  {/* <TableCaption className="text-right">
              Last updated at: {<LocaleDatetime datetime={lastUpdatedAt} />}
            </TableCaption> */}
                </Table>
              </div>
              <div className="flex items-center justify-between px-4">
                <div className="text-muted-foreground flex-1 text-sm lg:flex">
                  1-10 of {totalRows[0].value} rows.
                </div>
                {/* <div className="flex w-full items-center gap-8 lg:w-fit">
                            <div className="hidden items-center gap-2 lg:flex">
                              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                              </Label>
                              <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                  table.setPageSize(Number(value))
                                }}
                              >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                  <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                  />
                                </SelectTrigger>
                                <SelectContent side="top">
                                  {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                      {pageSize}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex w-fit items-center justify-center text-sm font-medium">
                              Page {table.getState().pagination.pageIndex + 1} of{" "}
                              {table.getPageCount()}
                            </div>
                            <div className="ml-auto flex items-center gap-2 lg:ml-0">
                              <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                              >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                              </Button>
                              <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                              >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                              </Button>
                              <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                              >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                              </Button>
                              <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                              >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                              </Button>
                            </div>
                          </div> */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
