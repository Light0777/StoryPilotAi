"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CharacterForm } from "@/components/characters/character-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCharacterPage() {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/characters/${id}`)
      .then((res) => res.json())
      .then((data) => setCharacter(data.character))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Character not found</h1>
        <p className="text-muted-foreground">The character you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Character</h1>
        <p className="text-muted-foreground">Update character details</p>
      </div>
      <CharacterForm
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialData={(character as any)}
        isEditing
      />
    </div>
  );
}
