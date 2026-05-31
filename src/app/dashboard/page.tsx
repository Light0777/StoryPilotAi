"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Image, CheckCircle, Clock } from "lucide-react";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRecentStories(data.recentStories || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your characters and content</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your characters and content
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Characters"
          value={stats?.activeCharacters ?? 0}
          icon={Users}
          description="Currently generating stories"
        />
        <StatCard
          title="Stories Generated"
          value={stats?.storiesGenerated ?? 0}
          icon={Image}
          description="Total stories created"
        />
        <StatCard
          title="Stories Published"
          value={stats?.storiesPublished ?? 0}
          icon={CheckCircle}
          description="Published to Instagram"
        />
        <StatCard
          title="Scheduled Stories"
          value={stats?.scheduledStories ?? 0}
          icon={Clock}
          description="Waiting to publish"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity
            activities={recentStories.map((s: Record<string, unknown>) => ({
              id: s.id as string,
              characterName: (s.character as Record<string, string>)?.name || "Unknown",
              action: `Story ${s.status === "published" ? "published" : "generated"}`,
              status: s.status as string,
              createdAt: new Date(s.createdAt as string),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
