"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { XCircle, ListOrdered, Database, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDateTime } from "@/lib/utils";

interface QueueItem {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: number;
}

const statusVariant: Record<string, "warning" | "info" | "success" | "destructive" | "secondary"> = {
  waiting: "warning",
  delayed: "info",
  active: "info",
  completed: "success",
  failed: "destructive",
};

export default function QueuePage() {
  const [jobs, setJobs] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [redisAvailable, setRedisAvailable] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/queue");
      const data = await res.json();
      setJobs(data.jobs || []);
      setRedisAvailable(data.redisAvailable !== false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const cancelJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/queue/${jobId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to cancel job");
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast({ title: "Job cancelled", variant: "success" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Story Queue</h1>
          <p className="text-muted-foreground">Monitor and manage queued jobs</p>
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Story Queue</h1>
          <p className="text-muted-foreground">Monitor and manage queued jobs</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={fetchJobs}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queued Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {!redisAvailable ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Database className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Redis Required</h3>
              <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                The queue system requires Redis to be running. Start Redis locally or set the{" "}
                <code className="rounded bg-muted px-1">REDIS_URL</code> environment variable.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                The rest of the app works fine without it — story generation runs immediately
                instead of being queued.
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ListOrdered className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Queue is empty</h3>
              <p className="text-sm text-muted-foreground">
                No jobs are currently queued. Jobs will appear when stories are scheduled.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-xs">{job.id.slice(0, 8)}...</TableCell>
                    <TableCell>{job.type === "story-generation" ? "Story Generation" : "Publishing"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[job.status] || "secondary"}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(new Date(job.createdAt))}
                    </TableCell>
                    <TableCell className="text-right">
                      {(job.status === "waiting" || job.status === "delayed") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelJob(job.id)}
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
