import { MobileShell } from "@/components/layout/MobileShell";
import { LearningPath } from "@/components/learning/LearningPath";

export default function HomePage() {
  return (
    <MobileShell showTopBar={true} showBottomNav={true}>
      <LearningPath />
    </MobileShell>
  );
}
