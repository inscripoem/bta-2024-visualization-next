"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchoolMap } from "@/components/school-map";
import { useVoteContext } from "../vote-context";

export default function SchoolsPage() {
  const { schoolData } = useVoteContext();

  return (
    <div className="p-3 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 opacity-0 animate-fade-up">
          <div className="lg:col-span-2 h-full">
            <SchoolMap data={schoolData} />
          </div>
        </div>

        <Card className="h-auto lg:col-span-1 opacity-0 animate-fade-up-delay">
          <CardHeader className="pb-2 my-2">
            <CardTitle>学校参与情况</CardTitle>
          </CardHeader>
          <CardContent className="h-auto">
            <ScrollArea className="h-[500px]">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left">学校</th>
                    <th className="p-2 text-left">参与人数</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolData.sort((a, b) => b.vote_count - a.vote_count).map((school) => (
                    <tr key={school.name}>
                      <td className="border-t border-gray-600 p-2">{school.name}</td>
                      <td className="border-t border-gray-600 p-2">{school.vote_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 