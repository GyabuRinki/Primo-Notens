import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Question } from "@shared/schema";

interface TestQuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: string;
  onAnswerChange?: (answer: string) => void;
  showCorrect?: boolean;
}

export function TestQuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerChange,
  showCorrect,
}: TestQuestionCardProps) {
  const isCorrect = showCorrect && selectedAnswer === question.correctAnswer;
  const isWrong = showCorrect && selectedAnswer && selectedAnswer !== question.correctAnswer;

  return (
    <Card className="p-6" data-testid={`card-question-${question.id}`}>
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Badge variant="secondary" className="shrink-0">Q{questionNumber}</Badge>
          <div className="flex-1">
            <p className="text-foreground font-medium mb-2">{question.question}</p>
            {showCorrect && question.explanation && (
              <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted/50 rounded-md">
                <span className="font-medium">Explanation: </span>
                {question.explanation}
              </p>
            )}
          </div>
        </div>
        <Badge variant="outline" className="shrink-0">
          {question.type === 'multiple-choice' ? 'MCQ' : 
           question.type === 'true-false' ? 'T/F' : 'Short'}
        </Badge>
      </div>

      <div className="ml-12">
        {question.type === 'multiple-choice' && question.options && (
          <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange}>
            {question.options.map((option, idx) => {
              const optionLetter = String.fromCharCode(65 + idx);
              const isThisCorrect = showCorrect && option === question.correctAnswer;
              const isThisWrong = showCorrect && selectedAnswer === option && option !== question.correctAnswer;
              
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    isThisCorrect ? 'bg-chart-3/10 border border-chart-3/30' :
                    isThisWrong ? 'bg-destructive/10 border border-destructive/30' :
                    'hover-elevate'
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`${question.id}-${idx}`}
                    disabled={showCorrect}
                    data-testid={`radio-option-${idx}`}
                  />
                  <Label
                    htmlFor={`${question.id}-${idx}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium text-muted-foreground mr-2">{optionLetter}.</span>
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        )}

        {question.type === 'true-false' && (
          <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange}>
            {['True', 'False'].map((option) => {
              const isThisCorrect = showCorrect && option === question.correctAnswer;
              const isThisWrong = showCorrect && selectedAnswer === option && option !== question.correctAnswer;
              
              return (
                <div
                  key={option}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    isThisCorrect ? 'bg-chart-3/10 border border-chart-3/30' :
                    isThisWrong ? 'bg-destructive/10 border border-destructive/30' :
                    'hover-elevate'
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`${question.id}-${option}`}
                    disabled={showCorrect}
                    data-testid={`radio-${option.toLowerCase()}`}
                  />
                  <Label htmlFor={`${question.id}-${option}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        )}

        {question.type === 'short-answer' && (
          <div>
            <Input
              value={selectedAnswer || ''}
              onChange={(e) => onAnswerChange?.(e.target.value)}
              placeholder="Type your answer..."
              disabled={showCorrect}
              className={
                isCorrect ? 'border-chart-3 bg-chart-3/10' :
                isWrong ? 'border-destructive bg-destructive/10' :
                ''
              }
              data-testid="input-short-answer"
            />
            {showCorrect && (
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-medium">Correct answer: </span>
                {question.correctAnswer}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
