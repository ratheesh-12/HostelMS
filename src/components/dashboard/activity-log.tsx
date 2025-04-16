
import { ActivityLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityLogListProps {
  logs: ActivityLog[];
  limit?: number;
}

export function ActivityLogList({ logs, limit = 5 }: ActivityLogListProps) {
  const displayLogs = limit ? logs.slice(0, limit) : logs;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayLogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No activity logs available</p>
        ) : (
          displayLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {log.action}
                </p>
                <div className="flex items-center mt-1">
                  <p className="text-xs text-muted-foreground">
                    By {log.adminName}
                    {log.targetUser && ` • Target: ${log.targetUser}`}
                  </p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
