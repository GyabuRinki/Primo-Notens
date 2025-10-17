import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
      correctAnswer: [],
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

  const addOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    const newOptions = [...(question.options || []), ""];
    updateQuestion(questionIndex, { options: newOptions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    const newOptions = question.options?.filter((_, i) => i !== optionIndex) || [];
    
    const removedLetter = String.fromCharCode(65 + optionIndex);
    const newCorrectAnswers = question.correctAnswer
      .filter(ans => ans !== removedLetter)
      .map(ans => {
        const answerIndex = ans.charCodeAt(0) - 65;
        if (answerIndex > optionIndex) {
          return String.fromCharCode(answerIndex + 64);
        }
        return ans;
      });
    
    updateQuestion(questionIndex, { options: newOptions, correctAnswer: newCorrectAnswers });
  };

  const toggleCorrectAnswer = (questionIndex: number, optionLetter: string) => {
    const question = questions[questionIndex];
    const currentAnswers = question.correctAnswer || [];
    const newAnswers = currentAnswers.includes(optionLetter)
      ? currentAnswers.filter(ans => ans !== optionLetter)
      : [...currentAnswers, optionLetter];
    updateQuestion(questionIndex, { correctAnswer: newAnswers });
  };

  const addIdentificationAnswer = (questionIndex: number) => {
    const question = questions[questionIndex];
    const newAnswers = [...(question.correctAnswer || []), ""];
    updateQuestion(questionIndex, { correctAnswer: newAnswers });
  };

  const updateIdentificationAnswer = (questionIndex: number, answerIndex: number, value: string) => {
    const question = questions[questionIndex];
    const newAnswers = [...(question.correctAnswer || [])];
    newAnswers[answerIndex] = value;
    updateQuestion(questionIndex, { correctAnswer: newAnswers });
  };

  const removeIdentificationAnswer = (questionIndex: number, answerIndex: number) => {
    const question = questions[questionIndex];
    const newAnswers = question.correctAnswer.filter((_, i) => i !== answerIndex);
    updateQuestion(questionIndex, { correctAnswer: newAnswers });
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
                  onValueChange={(value: any) => {
                    const updates: Partial<Question> = { type: value };
                    if (value === 'true-false') {
                      updates.correctAnswer = [];
                    } else if (value === 'identification') {
                      updates.correctAnswer = [];
                      updates.caseSensitive = false;
                    } else if (value === 'multiple-choice') {
                      updates.correctAnswer = [];
                    }
                    updateQuestion(index, updates);
                  }}
                >
                  <SelectTrigger className="mt-2" data-testid={`select-question-type-${index}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="identification">Identification</SelectItem>
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
                <>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Options</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addOption(index)}
                        data-testid={`button-add-option-${index}`}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {question.options?.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <span className="text-sm font-medium w-8">{String.fromCharCode(65 + optIndex)}.</span>
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(question.options || [])];
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(index, { options: newOptions });
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            data-testid={`input-option-${index}-${optIndex}`}
                            className="flex-1"
                          />
                          {question.options && question.options.length > 2 && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeOption(index, optIndex)}
                              data-testid={`button-remove-option-${index}-${optIndex}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Correct Answer(s)</Label>
                    <p className="text-sm text-muted-foreground mb-2">Select one or more correct answers</p>
                    <div className="space-y-2">
                      {question.options?.map((option, optIndex) => {
                        const optionLetter = String.fromCharCode(65 + optIndex);
                        return (
                          <div key={optIndex} className="flex items-center gap-2">
                            <Checkbox
                              id={`correct-${index}-${optIndex}`}
                              checked={question.correctAnswer?.includes(optionLetter)}
                              onCheckedChange={() => toggleCorrectAnswer(index, optionLetter)}
                              data-testid={`checkbox-correct-${index}-${optIndex}`}
                            />
                            <label
                              htmlFor={`correct-${index}-${optIndex}`}
                              className="text-sm cursor-pointer"
                            >
                              {optionLetter}. {option || `Option ${optionLetter}`}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {question.correctAnswer && question.correctAnswer.length > 1 && (
                    <>
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <Label>Allow Partial Credit</Label>
                          <p className="text-sm text-muted-foreground">
                            {question.partialCredit 
                              ? "Students get credit for selecting some correct answers" 
                              : "Students must select all correct answers to get credit"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={question.partialCredit || false}
                            onCheckedChange={(checked) => {
                              updateQuestion(index, { 
                                partialCredit: checked,
                                partialCreditMode: checked ? 'proportional' : undefined
                              });
                            }}
                            data-testid={`switch-partial-credit-${index}`}
                          />
                          <span className="text-sm text-muted-foreground">
                            {question.partialCredit ? "On" : "Off"}
                          </span>
                        </div>
                      </div>

                      {question.partialCredit && (
                        <div className="flex items-center justify-between pt-2 pl-4">
                          <div>
                            <Label>Partial Credit Scoring</Label>
                            <p className="text-sm text-muted-foreground">
                              {question.partialCreditMode === 'all-or-nothing'
                                ? "Students get full points only when all correct answers are selected"
                                : "Students get proportional points based on correct answers selected"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={question.partialCreditMode === 'proportional'}
                              onCheckedChange={(checked) => 
                                updateQuestion(index, { 
                                  partialCreditMode: checked ? 'proportional' : 'all-or-nothing' 
                                })
                              }
                              data-testid={`switch-partial-credit-mode-${index}`}
                            />
                            <span className="text-sm text-muted-foreground">
                              {question.partialCreditMode === 'proportional' ? "Proportional" : "All or Nothing"}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {question.type === 'true-false' && (
                <div>
                  <Label>Correct Answer</Label>
                  <Select
                    value={question.correctAnswer[0] || ""}
                    onValueChange={(value) => updateQuestion(index, { correctAnswer: [value] })}
                  >
                    <SelectTrigger className="mt-2" data-testid={`select-correct-answer-${index}`}>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="True">True</SelectItem>
                      <SelectItem value="False">False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {question.type === 'identification' && (
                <>
                  <div className="flex items-center justify-between">
                    <Label>Case Sensitive</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={question.caseSensitive || false}
                        onCheckedChange={(checked) => updateQuestion(index, { caseSensitive: checked })}
                        data-testid={`switch-case-sensitive-${index}`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {question.caseSensitive ? "On" : "Off"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Correct Answers</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addIdentificationAnswer(index)}
                        data-testid={`button-add-answer-${index}`}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Answer
                      </Button>
                    </div>
                    <div className="border rounded-md">
                      <div className="grid grid-cols-[1fr_auto] gap-2 p-2 bg-muted/50 border-b font-medium text-sm">
                        <div>Acceptable Answer</div>
                        <div className="w-10"></div>
                      </div>
                      {question.correctAnswer.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No answers added yet
                        </div>
                      ) : (
                        <div className="divide-y">
                          {question.correctAnswer.map((answer, ansIndex) => (
                            <div key={ansIndex} className="grid grid-cols-[1fr_auto] gap-2 p-2 items-center">
                              <Input
                                value={answer}
                                onChange={(e) => updateIdentificationAnswer(index, ansIndex, e.target.value)}
                                placeholder="Enter acceptable answer..."
                                data-testid={`input-answer-${index}-${ansIndex}`}
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeIdentificationAnswer(index, ansIndex)}
                                data-testid={`button-remove-answer-${index}-${ansIndex}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

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
