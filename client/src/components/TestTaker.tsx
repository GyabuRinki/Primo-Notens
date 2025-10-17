import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock } from "lucide-react";
import { TestQuestionCard } from "./TestQuestionCard";
import type { Test, TestResult, Question } from "@shared/schema";
import { localStorageService } from "@/lib/localStorage";

interface TestTakerProps {
  test: Test;
  onComplete: () => void;
}

export function TestTaker({ test, onComplete }: TestTakerProps) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
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

  const handleAnswerChange = (questionId: string, answer: string[]) => {
    setAnswers({ ...answers, [questionId]: answer });
    setAnsweredQuestions(prev => new Set(prev).add(questionId));
  };

  const getAnswerScore = (question: Question, userAnswer: string[]): number => {
    if (question.type === 'identification') {
      if (userAnswer.length === 0) return 0;
      const answer = userAnswer[0];
      if (!question.caseSensitive) {
        return question.correctAnswer.some(
          ans => ans.toLowerCase().trim() === answer.toLowerCase().trim()
        ) ? 1 : 0;
      }
      return question.correctAnswer.some(
        ans => ans.trim() === answer.trim()
      ) ? 1 : 0;
    }
    
    if (question.type === 'multiple-choice' && question.partialCredit && question.correctAnswer.length > 1) {
      if (userAnswer.length === 0) return 0;
      
      const correctSelected = userAnswer.filter(ans => question.correctAnswer.includes(ans)).length;
      const incorrectSelected = userAnswer.filter(ans => !question.correctAnswer.includes(ans)).length;
      
      if (incorrectSelected > 0) return 0;
      
      return correctSelected / question.correctAnswer.length;
    }
    
    const isExactMatch = JSON.stringify([...userAnswer].sort()) === JSON.stringify([...question.correctAnswer].sort());
    return isExactMatch ? 1 : 0;
  };

  const isAnswerCorrect = (question: Question, userAnswer: string[]): boolean => {
    return getAnswerScore(question, userAnswer) === 1;
  };

  const handleSubmit = () => {
    let totalScore = 0;
    test.questions.forEach((q) => {
      const userAnswer = answers[q.id] || [];
      totalScore += getAnswerScore(q, userAnswer);
    });

    const score = (totalScore / test.questions.length) * 100;
    
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

  const progress = (answeredQuestions.size / test.questions.length) * 100;

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
              <span>Progress: {answeredQuestions.size} / {test.questions.length}</span>
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
            You answered {test.questions.filter(q => isAnswerCorrect(q, answers[q.id] || [])).length} out of {test.questions.length} questions correctly
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
            disabled={test.questions.some(q => !answers[q.id] || answers[q.id].length === 0)}
            data-testid="button-submit-test"
          >
            Submit Test
          </Button>
        </div>
      )}
    </div>
  );
}
