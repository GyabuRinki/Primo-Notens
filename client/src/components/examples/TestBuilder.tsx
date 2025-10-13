import { TestBuilder } from "../TestBuilder";

export default function TestBuilderExample() {
  return (
    <TestBuilder
      test={null}
      onSave={(test) => console.log('Saved:', test)}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
