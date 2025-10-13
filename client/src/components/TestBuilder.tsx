import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react";
import type { Test, Question } from "@shared/schema";

interface TestBuilderProps {
  test: Test | null;
  onSave: (test: Test) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TestBuilder({ test, onSave, onCancel, onDelete }: TestBuilderProps) {
  const [title, setTitle] = useState(test?.title || "");
  const [description, setDescription] = useState(test?.description || "");
  const [subject, setSubject] = useState(test?.subject || "");
  const [timeLimit, setTimeLimit] = useState(test?.timeLimit?.toString() || "");
  const [questions, setQuestions] = useState<Question[]>(test?.questions || []);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: 'multiple-choice',
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      subject: subject || "General",
      tags: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim() || questions.length === 0) {
      alert("Please add a title and at least one question!");
      return;
    }

    const savedTest: Test = {
      id: test?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim() || "General",
      questions,
      timeLimit: timeLimit ? parseInt(timeLimit) : undefined,
      createdAt: test?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSave(savedTest);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <Button variant="ghost" onClick={onCancel} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {onDelete && (
            <Button variant="outline" onClick={onDelete} data-testid="button-delete-test">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={handleSave} data-testid="button-save-test">
            <Save className="h-4 w-4 mr-2" />
            Save Test
          </Button>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Test Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter test title..."
              className="mt-2"
              data-testid="input-test-title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter test description..."
              className="mt-2"
              data-testid="textarea-test-description"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics"
                className="mt-2"
                data-testid="input-test-subject"
              />
            </div>
            <div>
              <Label htmlFor="timeLimit">Time Limit (minutes, optional)</Label>
              <Input
                id="timeLimit"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="e.g., 60"
                className="mt-2"
                data-testid="input-test-time-limit"
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">Questions</h2>
        <Button onClick={addQuestion} variant="outline" data-testid="button-add-question">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="p-6">
            <div className="flex items-start justify-between mb-4 gap-4">
              <h3 className="font-medium">Question {index + 1}</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeQuestion(index)}
                data-testid={`button-remove-question-${index}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value: any) => updateQuestion(index, { type: value })}
                >
                  <SelectTrigger className="mt-2" data-testid={`select-question-type-${index}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Question</Label>
                <Input
                  value={question.question}
                  onChange={(e) => updateQuestion(index, { question: e.target.value })}
                  placeholder="Enter your question..."
                  className="mt-2"
                  data-testid={`input-question-text-${index}`}
                />
              </div>

              {question.type === 'multiple-choice' && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2 mt-2">
                    {question.options?.map((option, optIndex) => (
                      <Input
                        key={optIndex}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])];
                          newOptions[optIndex] = e.target.value;
                          updateQuestion(index, { options: newOptions });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        data-testid={`input-option-${index}-${optIndex}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Correct Answer</Label>
                {question.type === 'true-false' ? (
                  <Select
                    value={question.correctAnswer}
                    onValueChange={(value) => updateQuestion(index, { correctAnswer: value })}
                  >
                    <SelectTrigger className="mt-2" data-testid={`select-correct-answer-${index}`}>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="True">True</SelectItem>
                      <SelectItem value="False">False</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                    placeholder="Enter correct answer..."
                    className="mt-2"
                    data-testid={`input-correct-answer-${index}`}
                  />
                )}
              </div>

              <div>
                <Label>Explanation (Optional)</Label>
                <Textarea
                  value={question.explanation || ""}
                  onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                  placeholder="Explain why this is the correct answer..."
                  className="mt-2"
                  data-testid={`textarea-explanation-${index}`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
