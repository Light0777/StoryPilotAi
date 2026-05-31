import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, PauseCircle, PlayCircle, Trash2, Sparkles } from "lucide-react";

interface CharacterCardProps {
  character: {
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
  };
  onToggleStatus: (id: string, newStatus: string) => void;
  onDelete: (id: string) => void;
  onGenerate: (id: string) => void;
  generating?: boolean;
}

export function CharacterCard({ character, onToggleStatus, onDelete, onGenerate, generating }: CharacterCardProps) {
  const initials = character.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          {character.faceReferenceUrl ? (
            <AvatarImage src={character.faceReferenceUrl} alt={character.name} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{character.name}</CardTitle>
            <Badge variant={character.status === "active" ? "success" : "secondary"}>
              {character.status}
            </Badge>
            {character.autoPublish && (
              <Badge variant="info">Auto{character.publishTime ? ` \u00B7 ${character.publishTime}` : ""}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {character.storiesPerDay} story per day
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-medium text-foreground">Personality:</span>{" "}
            {character.personality}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-medium text-foreground">Mission:</span>{" "}
            {character.missionPrompt}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          className="gap-1"
          disabled={generating || character.status !== "active"}
          onClick={() => onGenerate(character.id)}
        >
          <Sparkles className="h-3 w-3" />
          {generating ? "Generating..." : "Generate"}
        </Button>
        <Link href={`/dashboard/characters/${character.id}/edit`}>
          <Button variant="ghost" size="sm">
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onToggleStatus(
              character.id,
              character.status === "active" ? "paused" : "active"
            )
          }
        >
          {character.status === "active" ? (
            <PauseCircle className="mr-1 h-4 w-4" />
          ) : (
            <PlayCircle className="mr-1 h-4 w-4" />
          )}
          {character.status === "active" ? "Pause" : "Resume"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => onDelete(character.id)}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
