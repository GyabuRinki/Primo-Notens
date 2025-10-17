import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Question } from "@shared/schema";

interface TestQuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: string[];
  onAnswerChange?: (answer: string[]) => void;
  showCorrect?: boolean;
}

export function TestQuestionCard({
  question,
  questionNumber,
  selectedAnswer = [],
  onAnswerChange,
  showCorrect,
}: TestQuestionCardProps) {
  const correctAnswers = Array.isArray(question.correctAnswer) 
    ? question.correctAnswer 
    : (question.correctAnswer as string).split(/[,|]/).map(a => a.trim()).filter(a => a);
  
  const isCorrect = showCorrect && 
    JSON.stringify([...selectedAnswer].sort()) === JSON.stringify([...correctAnswers].sort());
  const isWrong = showCorrect && selectedAnswer.length > 0 && !isCorrect;

  const toggleMultipleChoiceOption = (optionLetter: string) => {
    if (!onAnswerChange) return;
    const newAnswers = selectedAnswer.includes(optionLetter)
      ? selectedAnswer.filter(ans => ans !== optionLetter)
      : [...selectedAnswer, optionLetter];
    onAnswerChange(newAnswers);
  };

  const checkIdentificationAnswer = (userAnswer: string): boolean => {
    if (!question.caseSensitive) {
      return correctAnswers.some(
        ans => ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()
      );
    }
    return correctAnswers.some(
      ans => ans.trim() === userAnswer.trim()
    );
  };

  const isIdentificationCorrect = showCorrect && selectedAnswer.length > 0 && 
    checkIdentificationAnswer(selectedAnswer[0]);
  const isIdentificationWrong = showCorrect && selectedAnswer.length > 0 && 
    !checkIdentificationAnswer(selectedAnswer[0]);

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
           question.type === 'true-false' ? 'T/F' : 'ID'}
        </Badge>
      </div>

      <div className="ml-12">
        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, idx) => {
              const optionLetter = String.fromCharCode(65 + idx);
              const isThisCorrect = showCorrect && correctAnswers.includes(optionLetter);
              const isThisWrong = showCorrect && selectedAnswer.includes(optionLetter) && !correctAnswers.includes(optionLetter);
              
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    isThisCorrect ? 'bg-chart-3/10 border border-chart-3/30' :
                    isThisWrong ? 'bg-destructive/10 border border-destructive/30' :
                    'hover-elevate'
                  }`}
                >
                  <Checkbox
                    id={`${question.id}-${idx}`}
                    checked={selectedAnswer.includes(optionLetter)}
                    onCheckedChange={() => toggleMultipleChoiceOption(optionLetter)}
                    disabled={showCorrect}
                    data-testid={`checkbox-option-${idx}`}
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
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="space-y-2">
            {['True', 'False'].map((option) => {
              const isThisCorrect = showCorrect && correctAnswers.includes(option);
              const isThisWrong = showCorrect && selectedAnswer.includes(option) && !correctAnswers.includes(option);
              
              return (
                <div
                  key={option}
                  className={`flex items-center space-x-2 p-3 rounded-md ${
                    isThisCorrect ? 'bg-chart-3/10 border border-chart-3/30' :
                    isThisWrong ? 'bg-destructive/10 border border-destructive/30' :
                    'hover-elevate'
                  }`}
                >
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={selectedAnswer.includes(option)}
                    onCheckedChange={() => {
                      if (onAnswerChange) {
                        onAnswerChange([option]);
                      }
                    }}
                    disabled={showCorrect}
                    data-testid={`checkbox-${option.toLowerCase()}`}
                  />
                  <Label htmlFor={`${question.id}-${option}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        )}

        {question.type === 'identification' && (
          <div>
            <Input
              value={selectedAnswer[0] || ''}
              onChange={(e) => onAnswerChange?.([e.target.value])}
              placeholder="Type your answer..."
              disabled={showCorrect}
              className={
                isIdentificationCorrect ? 'border-chart-3 bg-chart-3/10' :
                isIdentificationWrong ? 'border-destructive bg-destructive/10' :
                ''
              }
              data-testid="input-identification-answer"
            />
            {showCorrect && (
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p className="font-medium">Acceptable answers:</p>
                <ul className="list-disc list-inside">
                  {correctAnswers.map((ans, idx) => (
                    <li key={idx}>{ans}</li>
                  ))}
                </ul>
                {!question.caseSensitive && (
                  <p className="text-xs italic">Case insensitive</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
