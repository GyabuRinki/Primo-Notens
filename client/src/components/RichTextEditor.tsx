import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [customTextColor, setCustomTextColor] = useState("#000000");
  const [customHighlightColor, setCustomHighlightColor] = useState("#FEF08A");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const colors = [
    { name: "Brown", value: "#8B4513" },
    { name: "Gold", value: "#DAA520" },
    { name: "Red", value: "#DC2626" },
    { name: "Blue", value: "#2563EB" },
    { name: "Green", value: "#16A34A" },
    { name: "Purple", value: "#9333EA" },
    { name: "Orange", value: "#EA580C" },
    { name: "White", value: "#FFFFFF" },
  ];

  const highlightColors = [
    { name: "None", value: "transparent" },
    { name: "Yellow", value: "#FEF08A" },
    { name: "Green", value: "#BBF7D0" },
    { name: "Blue", value: "#BFDBFE" },
    { name: "Pink", value: "#FBCFE8" },
    { name: "Orange", value: "#FED7AA" },
  ];

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("bold")}
          data-testid="button-format-bold"
          className="h-8 w-8"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("italic")}
          data-testid="button-format-italic"
          className="h-8 w-8"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("underline")}
          data-testid="button-format-underline"
          className="h-8 w-8"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              data-testid="button-text-size"
              className="h-8 w-8"
            >
              <Type className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand("fontSize", "2")}
                data-testid="button-size-small"
                className="justify-start"
              >
                <span className="text-xs">Small</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand("fontSize", "4")}
                data-testid="button-size-normal"
                className="justify-start"
              >
                <span className="text-sm">Normal</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => execCommand("fontSize", "6")}
                data-testid="button-size-large"
                className="justify-start"
              >
                <span className="text-lg">Large</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("justifyLeft")}
          data-testid="button-align-left"
          className="h-8 w-8"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("justifyCenter")}
          data-testid="button-align-center"
          className="h-8 w-8"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("justifyRight")}
          data-testid="button-align-right"
          className="h-8 w-8"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("justifyFull")}
          data-testid="button-align-justify"
          className="h-8 w-8"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("insertUnorderedList")}
          data-testid="button-format-ul"
          className="h-8 w-8"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("insertOrderedList")}
          data-testid="button-format-ol"
          className="h-8 w-8"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          size="icon"
          variant="ghost"
          onClick={() => execCommand("formatBlock", "pre")}
          data-testid="button-format-code"
          className="h-8 w-8"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              data-testid="button-text-color"
              className="h-8 w-8"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-2">Text Color</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => execCommand("foreColor", color.value)}
                      className="h-8 w-8 rounded-md border hover-elevate active-elevate-2"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      data-testid={`button-color-${color.name.toLowerCase()}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="custom-text-color" className="text-xs whitespace-nowrap">Custom:</Label>
                  <Input
                    id="custom-text-color"
                    type="color"
                    value={customTextColor}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    className="h-8 w-16 p-1 cursor-pointer"
                    data-testid="input-custom-text-color"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("foreColor", customTextColor)}
                    data-testid="button-apply-custom-text-color"
                  >
                    Apply
                  </Button>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium mb-2">Highlight</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {highlightColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => execCommand("hiliteColor", color.value)}
                      className="h-8 w-8 rounded-md border hover-elevate active-elevate-2"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      data-testid={`button-highlight-${color.name.toLowerCase()}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="custom-highlight-color" className="text-xs whitespace-nowrap">Custom:</Label>
                  <Input
                    id="custom-highlight-color"
                    type="color"
                    value={customHighlightColor}
                    onChange={(e) => setCustomHighlightColor(e.target.value)}
                    className="h-8 w-16 p-1 cursor-pointer"
                    data-testid="input-custom-highlight-color"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => execCommand("hiliteColor", customHighlightColor)}
                    data-testid="button-apply-custom-highlight-color"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        ref={editorRef}
        contentEditable
        spellCheck={false}
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none text-foreground"
        data-testid="editor-content"
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      />
    </div>
  );
}
