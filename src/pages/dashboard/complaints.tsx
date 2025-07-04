// pages/ComplaintsPage.tsx

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/dashboard/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Complaint } from "@/types";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  MessageSquare,
  Plus,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/layouts/dashboard-layout";

export default function ComplaintsPage() {
  const { user } = useAuth();
  const { complaints, updateComplaint, addComplaint } = useData();

  // For new complaint form
  const [newComplaint, setNewComplaint] = useState("");
  const [complaintCategory, setComplaintCategory] = useState("maintenance");
  const [complaintPriority, setComplaintPriority] = useState("medium");
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);

  // For response form
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("in-progress");
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);

  // For filtering
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter complaints based on user role and filters
  const getFilteredComplaints = () => {
    if (!user) return [];

    let filtered =
      user.role === "student"
        ? complaints.filter((c) => c.studentId === user.id)
        : complaints;

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((c) => c.category === categoryFilter);
    }

    return filtered;
  };

  const filteredComplaints = getFilteredComplaints();

  const handleSubmitComplaint = () => {
    if (!newComplaint.trim() || !user) return;

    const complaintData = {
      studentId: user.id,
      studentName: user.name,
      message: newComplaint,
      category: complaintCategory,
      priority: complaintPriority as "medium" | "low" | "high",
      status: "pending" as "pending",
      date: new Date().toISOString(),
    };

    addComplaint(complaintData);
    setNewComplaint("");
    setComplaintCategory("maintenance");
    setComplaintPriority("medium");
    setIsComplaintDialogOpen(false);

    toast.success("Complaint submitted successfully");
  };

  const handleSubmitResponse = () => {
    if (!selectedComplaint || !response.trim() || !user) return;

    updateComplaint(selectedComplaint.id, {
      response,
      status: status as "in-progress" | "resolved",
      staffId: user.id,
      staffName: user.name,
      verificationDate: new Date().toISOString(),
    });

    setResponse("");
    setStatus("in-progress");
    setSelectedComplaint(null);
    setIsResponseDialogOpen(false);

    toast.success("Response submitted successfully");
  };

  // Define columns for the data table based on user role
  const studentColumns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("en-IN"),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.category || "General"}
        </span>
      ),
    },
    {
      accessorKey: "message",
      header: "Complaint",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.original.message}</div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.priority === "high"
              ? "destructive"
              : row.original.priority === "medium"
              ? "default"
              : "outline"
          }
        >
          {row.original.priority
            ? row.original.priority.toUpperCase()
            : "NORMAL"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.status === "pending" ? (
            <Clock className="h-4 w-4 mr-1 text-amber-500" />
          ) : row.original.status === "in-progress" ? (
            <AlertTriangle className="h-4 w-4 mr-1 text-blue-500" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
          )}
          <div
            className={`inline-block px-2 py-1 rounded-full text-xs ${
              row.original.status === "pending"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                : row.original.status === "in-progress"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
            }`}
          >
            {row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "response",
      header: "Response",
      cell: ({ row }) => (
        <div>
          {row.original.response ? (
            <div className="max-w-[300px] truncate">
              {row.original.response}
              {row.original.staffName && (
                <div className="text-xs text-muted-foreground">
                  by {row.original.staffName}
                </div>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">Awaiting response</span>
          )}
        </div>
      ),
    },
  ];

  const staffColumns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.date).toLocaleDateString("en-IN"),
    },
    {
      accessorKey: "studentName",
      header: "Student",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.category || "General"}
        </span>
      ),
    },
    {
      accessorKey: "message",
      header: "Complaint",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.original.message}</div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.priority === "high"
              ? "destructive"
              : row.original.priority === "medium"
              ? "default"
              : "outline"
          }
        >
          {row.original.priority
            ? row.original.priority.toUpperCase()
            : "NORMAL"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.status === "pending" ? (
            <Clock className="h-4 w-4 mr-1 text-amber-500" />
          ) : row.original.status === "in-progress" ? (
            <AlertTriangle className="h-4 w-4 mr-1 text-blue-500" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
          )}
          <div
            className={`inline-block px-2 py-1 rounded-full text-xs ${
              row.original.status === "pending"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                : row.original.status === "in-progress"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
            }`}
          >
            {row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1)}
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isResolved = row.original.status === "resolved";
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedComplaint(row.original);
              setResponse(row.original.response || "");
              setStatus(row.original.status);
              setIsResponseDialogOpen(true);
            }}
            disabled={isResolved}
          >
            {isResolved
              ? "Resolved"
              : row.original.response
              ? "Update"
              : "Respond"}
          </Button>
        );
      },
    },
  ];

  const columns = user?.role === "student" ? studentColumns : staffColumns;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Complaints</h1>
          <p className="text-muted-foreground">
            View and manage student complaints
          </p>
        </div>

        {user?.role === "student" && (
          <Dialog open={isComplaintDialogOpen} onOpenChange={setIsComplaintDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a Complaint</DialogTitle>
                <DialogDescription>
                  Fill in the details of your complaint below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select value={complaintCategory} onValueChange={setComplaintCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={complaintPriority} onValueChange={setComplaintPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Complaint</Label>
                  <Textarea
                    placeholder="Describe your complaint"
                    value={newComplaint}
                    onChange={(e) => setNewComplaint(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmitComplaint}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Label>Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label>Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="cleanliness">Cleanliness</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredComplaints} />

      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Complaint</DialogTitle>
            <DialogDescription>
              Provide a response and update the complaint status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Response</Label>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitResponse}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
