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
import { member } from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { TableCellViewer } from "./component";
import { eq, desc } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export default async function Page() {
  const memberData = await db
    .select()
    .from(member)
    .where(eq(member.status, "CREATED"))
    .orderBy(desc(member.lastUpdatedAt));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-end px-4 lg:px-6">
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
                      </TableRow>
                    ))}
                  </TableBody>
                  {/* <TableCaption className="text-right">
              Last updated at: {<LocaleDatetime datetime={lastUpdatedAt} />}
            </TableCaption> */}
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
