import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger} from "./ui/tabs";
import { WorkRankItem } from "./work-rank-item";
import { Work } from "@/lib/data";
import { AnimatePresence } from "framer-motion";

interface WorkRankListProps {
  title: string;
  works: Work[];
  scoreType: "avg" | "nonzero_avg";
  scoreGetter: (work: Work) => { avg: number; nonzero_avg: number };
  listId: string;
}

export function WorkRankList({ 
  title, 
  works, 
  scoreType: initialScoreType,
  scoreGetter,
  listId,
}: WorkRankListProps) {
  const [scoreType, setScoreType] = useState(initialScoreType);

  // 根据分数类型获取排序后的作品列表
  const getSortedWorks = (type: "avg" | "nonzero_avg") => {
    return [...works].sort((a, b) => {
      const scoreA = scoreGetter(a)[type];
      const scoreB = scoreGetter(b)[type];
      return scoreB - scoreA;
    });
  };

  const currentWorks = getSortedWorks(scoreType);

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <Tabs 
            defaultValue={scoreType} 
            value={scoreType}
            onValueChange={(value) => setScoreType(value as "avg" | "nonzero_avg")}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="avg">均分</TabsTrigger>
              <TabsTrigger value="nonzero_avg">去零均分</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <AnimatePresence mode="popLayout">
          <div className="space-y-6">
            {currentWorks.map((work, index) => (
              <WorkRankItem
                key={work.title}
                title={work.title}
                score={scoreGetter(work)[scoreType]}
                rank={index + 1}
                listId={listId}
              />
            ))}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
} 