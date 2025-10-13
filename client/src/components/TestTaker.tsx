import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock } from "lucide-react";
import { TestQuestionCard } from "./TestQuestionCard";
import type { Test, TestResult } from "@shared/schema";
import { localStorageService } from "@/lib/localStorage";

interface TestTakerProps {
  test: Test;
  onComplete: () => void;
}

export function TestTaker({ test, onComplete }: TestTakerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(test.timeLimit ? test.timeLimit * 60 : null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    if (timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    test.questions.forEach((q) => {
      if (answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
        correctCount++;
      }
    });

    const score = (correctCount / test.questions.length) * 100;
    
    const testResult: TestResult = {
      id: crypto.randomUUID(),
      testId: test.id,
      answers,
      score,
      totalQuestions: test.questions.length,
      completedAt: Date.now(),
    };

    const results = localStorageService.getTestResults();
    localStorageService.saveTestResults([...results, testResult]);

    setResult(testResult);
    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (Object.keys(answers).length / test.questions.length) * 100;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <Button variant="ghost" onClick={onComplete} data-testid="button-exit-test">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Test
        </Button>
        {timeRemaining !== null && !isSubmitted && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className={timeRemaining < 60 ? 'text-destructive font-medium' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      <Card className="p-6 mb-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground mb-2">
          {test.title}
        </h1>
        {test.description && (
          <p className="text-muted-foreground mb-4">{test.description}</p>
        )}
        {!isSubmitted && (
          <>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progress: {Object.keys(answers).length} / {test.questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </>
        )}
      </Card>

      {isSubmitted && result && (
        <Card className="p-6 mb-6 text-center">
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
            Test Complete!
          </h2>
          <div className="text-5xl font-bold text-primary my-4">
            {result.score.toFixed(1)}%
          </div>
          <p className="text-muted-foreground">
            You answered {test.questions.filter(q => answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()).length} out of {test.questions.length} questions correctly
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {test.questions.map((question, index) => (
          <TestQuestionCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
            selectedAnswer={answers[question.id]}
            onAnswerChange={(answer) => handleAnswerChange(question.id, answer)}
            showCorrect={isSubmitted}
          />
        ))}
      </div>

      {!isSubmitted && (
        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== test.questions.length}
            data-testid="button-submit-test"
          >
            Submit Test
          </Button>
        </div>
      )}
    </div>
  );
}
