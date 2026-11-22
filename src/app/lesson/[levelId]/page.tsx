import { notFound } from "next/navigation";
import { getAllLevels, getLevelById } from "@/data/curriculum";
import { LessonRunner } from "@/components/lesson/LessonRunner";

interface LessonPageProps {
  params: Promise<{ levelId: string }>;
}

export function generateStaticParams() {
  const allLevels = getAllLevels();
  return allLevels.map((level) => ({
    levelId: level.id,
  }));
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { levelId } = await params;
  const level = getLevelById(levelId);

  if (!level) {
    notFound();
  }

  return <LessonRunner level={level} />;
}
