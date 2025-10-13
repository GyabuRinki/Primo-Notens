import { FlashcardEditor } from "../FlashcardEditor";

export default function FlashcardEditorExample() {
  return (
    <FlashcardEditor
      flashcard={null}
      onSave={(card) => console.log('Saved:', card)}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
