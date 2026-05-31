import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

interface Activity {
  id: string;
  characterName: string;
  action: string;
  status: string;
  createdAt: Date;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No recent activity
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Character</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell className="font-medium">{activity.characterName}</TableCell>
            <TableCell>{activity.action}</TableCell>
            <TableCell>
              <Badge
                variant={
                  activity.status === "published" || activity.status === "completed"
                    ? "success"
                    : activity.status === "failed"
                    ? "destructive"
                    : activity.status === "generating"
                    ? "warning"
                    : "info"
                }
              >
                {activity.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDateTime(activity.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
