import { CharacterForm } from "@/components/characters/character-form";

export default function NewCharacterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Character</h1>
        <p className="text-muted-foreground">
          Set up a new AI character for story generation
        </p>
      </div>
      <CharacterForm />
    </div>
  );
}
