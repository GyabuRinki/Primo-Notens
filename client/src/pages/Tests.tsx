import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Play, Download, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localStorageService } from "@/lib/localStorage";
import type { Test } from "@shared/schema";
import { TestBuilder } from "@/components/TestBuilder";
import { TestTaker } from "@/components/TestTaker";
import { exportTestsToText, importTestsFromText, downloadTextFile, uploadTextFile } from "@/lib/importExport";
import { useToast } from "@/hooks/use-toast";

export default function Tests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTaking, setIsTaking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadedTests = localStorageService.getTests();
    setTests(loadedTests);
  }, []);

  const createNewTest = () => {
    setSelectedTest(null);
    setIsCreating(true);
  };

  const handleSaveTest = (test: Test) => {
    const existingIndex = tests.findIndex(t => t.id === test.id);
    let updatedTests: Test[];
    
    if (existingIndex >= 0) {
      updatedTests = [...tests];
      updatedTests[existingIndex] = test;
    } else {
      updatedTests = [test, ...tests];
    }
    
    setTests(updatedTests);
    localStorageService.saveTests(updatedTests);
    setIsCreating(false);
    setSelectedTest(null);
  };

  const handleDeleteTest = (testId: string) => {
    const updatedTests = tests.filter(t => t.id !== testId);
    setTests(updatedTests);
    localStorageService.saveTests(updatedTests);
    setSelectedTest(null);
    setIsCreating(false);
  };

  const handleTakeTest = (test: Test) => {
    setSelectedTest(test);
    setIsTaking(true);
  };

  const handleExportTests = () => {
    if (tests.length === 0) {
      toast({
        title: "No tests to export",
        description: "Create some tests first before exporting.",
        variant: "destructive",
      });
      return;
    }

    const exportText = exportTestsToText(tests);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadTextFile(exportText, `tests_${timestamp}.txt`);
    
    toast({
      title: "Tests exported",
      description: `${tests.length} tests have been exported successfully.`,
    });
  };

  const handleImportTests = async () => {
    try {
      const text = await uploadTextFile();
      const importedTests = importTestsFromText(text);
      
      if (importedTests.length === 0) {
        toast({
          title: "Import failed",
          description: "No valid tests found in the file.",
          variant: "destructive",
        });
        return;
      }

      const newTests = importedTests.map(test => ({
        ...test,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      
      const updatedTests = [...newTests, ...tests];
      
      setTests(updatedTests);
      localStorageService.saveTests(updatedTests);
      
      toast({
        title: "Tests imported",
        description: `${newTests.length} tests have been imported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import tests",
        variant: "destructive",
      });
    }
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isTaking && selectedTest) {
    return (
      <TestTaker
        test={selectedTest}
        onComplete={() => {
          setIsTaking(false);
          setSelectedTest(null);
        }}
      />
    );
  }

  if (isCreating || (selectedTest && !isTaking)) {
    return (
      <TestBuilder
        test={selectedTest}
        onSave={handleSaveTest}
        onCancel={() => {
          setIsCreating(false);
          setSelectedTest(null);
        }}
        onDelete={selectedTest ? () => handleDeleteTest(selectedTest.id) : undefined}
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Mock Tests</h1>
          <p className="text-muted-foreground">Create and take practice exams</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={handleExportTests} variant="outline" data-testid="button-export-tests">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleImportTests} variant="outline" data-testid="button-import-tests">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={createNewTest} data-testid="button-create-test">
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-tests"
        />
      </div>

      {filteredTests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "No tests found matching your search." : "No tests yet. Create your first test to start practicing!"}
          </p>
          {!searchQuery && (
            <Button onClick={createNewTest} variant="outline" data-testid="button-create-first-test">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Test
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTests.map(test => (
            <Card
              key={test.id}
              className="p-4 hover-elevate active-elevate-2 transition-all"
              data-testid={`card-test-${test.id}`}
            >
              <div className="mb-3">
                <h3 className="font-semibold text-foreground mb-1" data-testid={`text-test-title-${test.id}`}>
                  {test.title}
                </h3>
                {test.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {test.description}
                  </p>
                )}
                <Badge variant="secondary">{test.subject}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>{test.questions.length} questions</span>
                {test.timeLimit && <span>{test.timeLimit} min</span>}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleTakeTest(test)}
                  className="flex-1"
                  data-testid={`button-take-test-${test.id}`}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Take Test
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTest(test)}
                  data-testid={`button-edit-test-${test.id}`}
                >
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
