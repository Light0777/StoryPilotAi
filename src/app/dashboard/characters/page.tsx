"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CharacterCard } from "@/components/characters/character-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Character {
  id: string;
  name: string;
  personality: string;
  missionPrompt: string;
  storiesPerDay: number;
  faceReferenceUrl?: string | null;
  autoPublish: boolean;
  publishTime?: string | null;
  status: string;
  createdAt: Date;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const fetchCharacters = useCallback(async () => {
    try {
      const res = await fetch("/api/characters");
      const data = await res.json();
      setCharacters(data.characters || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const handleToggleStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/characters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setCharacters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      toast({
        title: `Character ${newStatus === "active" ? "resumed" : "paused"}`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this character?")) return;

    try {
      const res = await fetch(`/api/characters/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setCharacters((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Character deleted", variant: "success" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async (id: string) => {
    setGeneratingId(id);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Generation failed");
      }

      toast({
        title: "Story generated!",
        description: "Check the Generated Content page to view it.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setGeneratingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Characters</h1>
            <p className="text-muted-foreground">Manage your AI characters</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Characters</h1>
          <p className="text-muted-foreground">Manage your AI characters</p>
        </div>
        <Link href="/dashboard/characters/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Character
          </Button>
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12">
          <Users className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No characters yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first AI character to start generating stories.
          </p>
          <Link href="/dashboard/characters/new">
            <Button className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create Character
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onGenerate={handleGenerate}
              generating={generatingId === character.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
