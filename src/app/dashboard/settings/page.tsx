"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const MASKED = "••••••••";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    prompt_provider: "openai",
    openai_api_key: "",
    openrouter_api_key: "",
    openrouter_model: "openai/gpt-4o-mini",
    image_provider: "openai",
    image_provider_api_key: "",
    huggingface_api_key: "",
    buffer_access_token: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const masked = (key: keyof typeof settings) =>
    settings[key] === MASKED ? "" : settings[key];

  const update = (key: keyof typeof settings, value: string) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body: Record<string, string> = {
      prompt_provider: settings.prompt_provider,
      image_provider: settings.image_provider,
      openrouter_model: settings.openrouter_model,
    };

    if (settings.openai_api_key && settings.openai_api_key !== MASKED)
      body.openai_api_key = settings.openai_api_key;
    if (settings.openrouter_api_key && settings.openrouter_api_key !== MASKED)
      body.openrouter_api_key = settings.openrouter_api_key;
    if (settings.image_provider_api_key && settings.image_provider_api_key !== MASKED)
      body.image_provider_api_key = settings.image_provider_api_key;
    if (settings.huggingface_api_key && settings.huggingface_api_key !== MASKED)
      body.huggingface_api_key = settings.huggingface_api_key;
    if (settings.buffer_access_token && settings.buffer_access_token !== MASKED)
      body.buffer_access_token = settings.buffer_access_token;

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      toast({ title: "Settings saved", variant: "success" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const showKey = (key: keyof typeof settings) =>
    !loading ? (settings[key] === MASKED ? MASKED : settings[key]) : "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="text-muted-foreground">Configure AI providers and integrations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Prompt Generation</CardTitle>
            </div>
            <CardDescription>
              Choose which AI service writes story plans and captions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt_provider">Provider</Label>
              <Select
                value={settings.prompt_provider}
                onValueChange={(v) => update("prompt_provider", v)}
              >
                <SelectTrigger id="prompt_provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (GPT-4o-mini)</SelectItem>
                  <SelectItem value="openrouter">
                    OpenRouter (Free models available)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.prompt_provider === "openai" ? (
              <div className="space-y-2">
                <Label htmlFor="openai_api_key">OpenAI API Key</Label>
                <Input
                  id="openai_api_key"
                  type="password"
                  placeholder={showKey("openai_api_key") ? MASKED : "sk-..."}
                  value={masked("openai_api_key")}
                  onChange={(e) => update("openai_api_key", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Used for story planning and caption generation via GPT-4o-mini
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="openrouter_api_key">OpenRouter API Key</Label>
                  <Input
                    id="openrouter_api_key"
                    type="password"
                    placeholder={showKey("openrouter_api_key") ? MASKED : "sk-or-..."}
                    value={masked("openrouter_api_key")}
                    onChange={(e) => update("openrouter_api_key", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get a free key at openrouter.ai/keys
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openrouter_model">Model</Label>
                  <Input
                    id="openrouter_model"
                    placeholder="openai/gpt-4o-mini"
                    value={settings.openrouter_model}
                    onChange={(e) => update("openrouter_model", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Free options: openai/gpt-4o-mini, google/gemma-2-9b-it, mistralai/mistral-7b-instruct
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Image Generation</CardTitle>
            </div>
            <CardDescription>
              Choose which AI service generates story images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image_provider">Provider</Label>
              <Select
                value={settings.image_provider}
                onValueChange={(v) => update("image_provider", v)}
              >
                <SelectTrigger id="image_provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI DALL-E 3</SelectItem>
                  <SelectItem value="pollinations">
                    Pollinations.ai FLUX (Free, no API key needed)
                  </SelectItem>
                  <SelectItem value="huggingface">
                    Hugging Face FLUX.1 Schnell (Free)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.image_provider === "openai" ? (
              <div className="space-y-2">
                <Label htmlFor="image_provider_api_key">OpenAI API Key</Label>
                <Input
                  id="image_provider_api_key"
                  type="password"
                  placeholder={showKey("image_provider_api_key") ? MASKED : "sk-..."}
                  value={masked("image_provider_api_key")}
                  onChange={(e) => update("image_provider_api_key", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to reuse the key from Prompt Generation above
                </p>
              </div>
            ) : settings.image_provider === "pollinations" ? (
              <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                No API key required — Pollinations.ai is free and open-source.
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="huggingface_api_key">Hugging Face API Key</Label>
                <Input
                  id="huggingface_api_key"
                  type="password"
                  placeholder={showKey("huggingface_api_key") ? MASKED : "hf_..."}
                  value={masked("huggingface_api_key")}
                  onChange={(e) => update("huggingface_api_key", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Get a free token at huggingface.co/settings/tokens. Uses FLUX.1 Schnell.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <CardDescription>
              Connect your Buffer account for auto-publishing to Instagram
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buffer_access_token">Buffer Access Token</Label>
              <Input
                id="buffer_access_token"
                type="password"
                placeholder={showKey("buffer_access_token") ? MASKED : "Enter Buffer token"}
                value={masked("buffer_access_token")}
                onChange={(e) => update("buffer_access_token", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving || loading}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </form>
    </div>
  );
}
