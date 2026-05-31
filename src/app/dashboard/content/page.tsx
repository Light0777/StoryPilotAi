"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, Trash2, Send, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDateTime } from "@/lib/utils";

interface Story {
  id: string;
  imageUrl: string;
  caption: string;
  status: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  character: { name: string };
}

const statusVariant: Record<string, "success" | "secondary" | "warning" | "info" | "destructive"> = {
  published: "success",
  generated: "secondary",
  generating: "warning",
  publishing: "info",
  failed: "destructive",
};

export default function ContentPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const publishNow = async (storyId: string) => {
    try {
      const res = await fetch(`/api/content/${storyId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Publishing failed");
      toast({ title: "Story queued for publishing", variant: "success" });
      fetchStories();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Publishing failed",
        variant: "destructive",
      });
    }
  };

  const deleteStory = async (storyId: string) => {
    if (!confirm("Delete this story?")) return;
    try {
      const res = await fetch(`/api/content/${storyId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setStories((prev) => prev.filter((s) => s.id !== storyId));
      toast({ title: "Story deleted", variant: "success" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Delete failed",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Generated Content</h1>
          <p className="text-muted-foreground">View and manage generated stories</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generated Content</h1>
          <p className="text-muted-foreground">View and manage generated stories</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={fetchStories}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12">
          <Image className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No content yet</h3>
          <p className="text-sm text-muted-foreground">
            Generated stories will appear here once they are created.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <Card key={story.id} className="overflow-hidden">
              <div className="aspect-[9/16] bg-muted">
                <img
                  src={story.imageUrl}
                  alt="Story"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x711?text=Story";
                  }}
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{story.character.name}</CardTitle>
                  <Badge variant={statusVariant[story.status as keyof typeof statusVariant] || "secondary"}>
                    {story.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3">{story.caption}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {story.publishedAt
                    ? `Published ${formatDateTime(story.publishedAt)}`
                    : `Created ${formatDateTime(story.createdAt)}`}
                </p>
                <div className="mt-3 flex gap-2">
                  {!story.published && story.status !== "publishing" && (
                    <Button size="sm" variant="default" className="gap-1" onClick={() => publishNow(story.id)}>
                      <Send className="h-3 w-3" /> Publish
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => deleteStory(story.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
