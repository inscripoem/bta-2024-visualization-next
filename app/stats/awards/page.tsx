"use client"

import { useState, useEffect } from "react";
import Select from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkRankList } from "@/components/work-rank-list";
import { useVoteContext } from "../vote-context";
import { Loading } from "@/components/loading";

export default function AwardsPage() {
  const { awards, schoolData, loading } = useVoteContext();
  const [selectedAward, setSelectedAward] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [open, setOpen] = useState(false);

  // 将奖项数据转换为 Select 组件需要的格式
  const awardOptions = awards?.map(award => ({
    id: award.name,
    label: award.name,
    value: award.name,
    description: ``,
    icon: "🏆",
  })) || [];

  // 在数据加载完成后设置初始奖项
  useEffect(() => {
    if (!loading && awards?.length > 0 && !selectedAward) {
      setSelectedAward(awards[0].name);
    }
  }, [loading, awards, selectedAward]);

  // 获取当前选中奖项的作品
  const currentAward = awards?.find(award => award.name === selectedAward);
  const works = currentAward?.works || [];

  // 获取所有学校名称（从 schoolData 中获取）并转换为选项格式
  const schoolOptions = schoolData?.length > 0
    ? schoolData
        .map(school => ({
          value: school.name,
          label: school.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
    : [];

  if (loading) {
    return <Loading className="h-screen" />;
  }

  return (
    <div className="p-3 md:p-8">
      <div className="mb-8 flex justify-center">
        <Select 
          data={awardOptions} 
          value={selectedAward}
          onChange={setSelectedAward}
        />
      </div>

      {currentAward && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 总体排名 */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">总体排名</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 人均排名 */}
                <div className="opacity-0 animate-fade-up">
                  <WorkRankList
                    title="人均排名"
                    works={works}
                    scoreType="avg"
                    scoreGetter={(work) => work.total_avg}
                    listId="per-person"
                  />
                </div>

                {/* 校均排名 */}
                <div className="opacity-0 animate-fade-up-delay">
                  <WorkRankList
                    title="校均排名"
                    works={works}
                    scoreType="avg"
                    scoreGetter={(work) => work.total_school_avg}
                    listId="per-school"
                  />
                </div>
              </div>
            </div>

            {/* 各校排名 */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">各校排名</h2>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {selectedSchool || "选择学校"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="搜索学校..." />
                      <CommandList>
                        <CommandEmpty>未找到学校</CommandEmpty>
                        <CommandGroup>
                          {schoolOptions.map((school) => (
                            <CommandItem
                              key={school.value}
                              value={school.value}
                              onSelect={(currentValue) => {
                                setSelectedSchool(currentValue === selectedSchool ? "" : currentValue)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedSchool === school.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {school.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {selectedSchool ? (
                <WorkRankList
                  title={`${selectedSchool}`}
                  works={works.filter(work => 
                    work.school_avg.some(s => s.school_name === selectedSchool)
                  )}
                  scoreType="avg"
                  scoreGetter={(work) => {
                    const schoolScore = work.school_avg.find(
                      s => s.school_name === selectedSchool
                    );
                    return schoolScore || { avg: 0, nonzero_avg: 0 };
                  }}
                  listId={`school-${selectedSchool}`}
                />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  请选择要查看的学校
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

