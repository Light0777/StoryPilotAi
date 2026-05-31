"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormField, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import type { CharacterFormData } from "@/types";

interface CharacterFormProps {
  initialData?: Partial<CharacterFormData & { id: string }>;
  isEditing?: boolean;
}

export function CharacterForm({ initialData, isEditing }: CharacterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<CharacterFormData>({
    name: initialData?.name || "",
    personality: initialData?.personality || "",
    missionPrompt: initialData?.missionPrompt || "",
    storiesPerDay: initialData?.storiesPerDay || 2,
    faceReferenceUrl: initialData?.faceReferenceUrl || "",
    autoPublish: initialData?.autoPublish || false,
    publishTime: initialData?.publishTime || "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CharacterFormData, string>>>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, faceReferenceUrl: data.url }));
      toast({ title: "Image uploaded successfully", variant: "success" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CharacterFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.personality.trim()) newErrors.personality = "Personality is required";
    if (!formData.missionPrompt.trim()) newErrors.missionPrompt = "Mission prompt is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const url = isEditing
        ? `/api/characters/${initialData?.id}`
        : "/api/characters";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save character");
      }

      toast({
        title: isEditing ? "Character updated" : "Character created",
        variant: "success",
      });
      router.push("/dashboard/characters");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <FormField>
          <FormLabel htmlFor="name">Character Name</FormLabel>
          <Input
            id="name"
            placeholder="e.g. Sophia Chen"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
          {errors.name && <FormMessage>{errors.name}</FormMessage>}
        </FormField>

        <FormField>
          <FormLabel htmlFor="storiesPerDay">Stories Per Day</FormLabel>
          <Input
            id="storiesPerDay"
            type="number"
            min={1}
            max={10}
            value={formData.storiesPerDay}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                storiesPerDay: parseInt(e.target.value) || 1,
              }))
            }
          />
          <FormDescription>How many stories to generate daily (1-10)</FormDescription>
        </FormField>
      </div>

      <FormField>
        <FormLabel htmlFor="personality">Personality</FormLabel>
        <Textarea
          id="personality"
          placeholder="Describe the character's personality, voice, and style..."
          className="min-h-[100px]"
          value={formData.personality}
          onChange={(e) => setFormData((prev) => ({ ...prev, personality: e.target.value }))}
        />
        {errors.personality && <FormMessage>{errors.personality}</FormMessage>}
      </FormField>

      <FormField>
        <FormLabel htmlFor="missionPrompt">Long-term Story Prompt</FormLabel>
        <Textarea
          id="missionPrompt"
          placeholder='e.g. "This model is currently on a world tour. Generate 2 Instagram stories per day. Take photos in famous locations around the world. Maintain a realistic travel narrative..."'
          className="min-h-[150px]"
          value={formData.missionPrompt}
          onChange={(e) => setFormData((prev) => ({ ...prev, missionPrompt: e.target.value }))}
        />
        {errors.missionPrompt && <FormMessage>{errors.missionPrompt}</FormMessage>}
        <FormDescription>
          This prompt guides the AI in generating consistent, narrative-driven content.
        </FormDescription>
      </FormField>

      <FormField>
        <FormLabel>Face Reference Image</FormLabel>
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : formData.faceReferenceUrl ? (
            <div className="text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Image uploaded</p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {isDragActive
                  ? "Drop the image here"
                  : "Drag & drop or click to upload"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PNG, JPG or WebP (max 5MB)
              </p>
            </div>
          )}
        </div>
      </FormField>

      <FormField>
        <div className="flex items-center gap-4">
          <Switch
            id="autoPublish"
            checked={formData.autoPublish}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, autoPublish: checked }))
            }
          />
          <div>
            <Label htmlFor="autoPublish">Enable Auto Publishing</Label>
            <FormDescription>
              Automatically publish generated stories to Instagram via Buffer
            </FormDescription>
          </div>
        </div>
      </FormField>

      {formData.autoPublish && (
        <FormField>
          <FormLabel htmlFor="publishTime">Publish Time</FormLabel>
          <Input
            id="publishTime"
            type="time"
            value={formData.publishTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, publishTime: e.target.value }))
            }
          />
          <FormDescription>
            Story will be generated and published at this time every day
          </FormDescription>
        </FormField>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading || uploading}>
          {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Character" : "Create Character"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
