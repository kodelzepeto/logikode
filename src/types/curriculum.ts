export type QuestionType = "multiple_choice" | "code_order" | "fill_blank";

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple_choice";
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
}

export interface CodeOrderQuestion extends BaseQuestion {
  type: "code_order";
  blocks: string[];
  correctOrder: string[];
}

export interface FillBlankQuestion extends BaseQuestion {
  type: "fill_blank";
  codeTemplate: string; // Harus mengandung placeholder '___'
  options: string[];
  correctAnswer: string;
}

export type Question =
  | MultipleChoiceQuestion
  | CodeOrderQuestion
  | FillBlankQuestion;

export interface Level {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  xpReward?: number;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  levels: Level[];
}
