import { useState } from "react";
import { RichTextEditor } from "../RichTextEditor";

export default function RichTextEditorExample() {
  const [content, setContent] = useState("<p>Start typing and use the formatting toolbar above...</p>");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Start writing..."
      />
    </div>
  );
}
