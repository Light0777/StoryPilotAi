"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Play, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CharacterDetail {
  id: string;
  name: string;
  personality: string;
  missionPrompt: string;
  storiesPerDay: number;
  faceReferenceUrl?: string | null;
  autoPublish: boolean;
  status: string;
  createdAt: string;
  _count: {
    generatedStories: number;
    storyPlans: number;
  };
}

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/characters/${id}`)
      .then((res) => res.json())
      .then((data) => setCharacter(data.character))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId: id }),
      });

      if (!res.ok) throw new Error("Generation failed");

      toast({ title: "Story generated successfully", variant: "success" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Generation failed",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/characters">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold sm:text-3xl">Character not found</h1>
      </div>
    );
  }

  const initials = character.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/characters">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Characters
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {character.faceReferenceUrl && (
                  <AvatarImage src={character.faceReferenceUrl} alt={character.name} />
                )}
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{character.name}</CardTitle>
                  <Badge variant={character.status === "active" ? "success" : "secondary"}>
                    {character.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {character.storiesPerDay} stories per day
                  {character.autoPublish && " • Auto-publish enabled"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/characters/${id}/edit`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              </Link>
              <Button size="sm" className="gap-2" onClick={handleGenerate} disabled={generating}>
                <Play className="h-4 w-4" /> Generate Now
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Stories Generated</p>
              <p className="text-2xl font-bold">{character._count.generatedStories}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Story Plans</p>
              <p className="text-2xl font-bold">{character._count.storyPlans}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-2xl font-bold">
                {new Date(character.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold">Personality</h3>
              <p className="text-sm text-muted-foreground">{character.personality}</p>
            </div>
            <div>
              <h3 className="font-semibold">Long-term Story Prompt</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {character.missionPrompt}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
