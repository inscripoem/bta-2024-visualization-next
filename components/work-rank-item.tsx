import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

interface WorkRankItemProps {
  title: string;
  score: number;
  rank: number;
  listId: string;
}

export function WorkRankItem({ title, score, rank, listId }: WorkRankItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      className="h-20"
    >
      <Card className="relative h-full overflow-hidden group rounded-2xl shadow-lg">
        <div className="absolute inset-0 z-0">
          <div className="relative h-full">
            <Image
              src={`/covers/${title}.webp`}
              alt={title}
              fill
              className="object-cover object-left transition-transform duration-300 group-hover:scale-105 dark:brightness-[0.2]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={100}
            />
          </div>
          <div className="absolute inset-0 [background:linear-gradient(110deg,transparent_50%,rgba(0,0,0,0.75)_100%)]" />
        </div>

        <CardContent className="relative z-10 h-full p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold line-clamp-1 text-primary-foreground mt-1">{title}</div>
            <motion.div 
              className="text-md text-muted-foreground"
              layoutId={`score-${listId}-${title}`}
            >
              {score.toFixed(2)} 分
            </motion.div>
          </div>

          <div className="flex flex-col items-end">
            <motion.div 
              className="text-4xl font-bold text-primary"
              layoutId={`rank-${listId}-${title}`}
            >
              #{rank}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 