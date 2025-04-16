
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export default function ComplaintsPage() {
  const { user } = useAuth();
  const { complaints, updateComplaint, addComplaint } = useData();
  
  // For new complaint form
  const [newComplaint, setNewComplaint] = useState("");
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  
  // For response form
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("in-progress");
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);

  // Filter complaints based on user role
  const filteredComplaints = user?.role === "student"
    ? complaints.filter(c => c.studentId === user.id)
    : complaints;

  const handleSubmitComplaint = () => {
    if (!newComplaint.trim() || !user) return;
    
    addComplaint({
      studentId: user.id,
      studentName: user.name,
      message: newComplaint,
      status: "pending",
      date: new Date().toISOString()
    });

    setNewComplaint("");
    setIsComplaintDialogOpen(false);
  };

  const handleSubmitResponse = () => {
    if (!selectedComplaint || !response.trim() || !user) return;
    
    updateComplaint(selectedComplaint.id, {
      response,
      status: status as "in-progress" | "resolved",
      staffId: user.id,
      staffName: user.name
    });

    setResponse("");
    setStatus("in-progress");
    setSelectedComplaint(null);
    setIsResponseDialogOpen(false);
  };

  // Define columns for the data table based on user role
  const studentColumns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString()
    },
    {
      accessorKey: "message",
      header: "Complaint",
      cell: ({ row }) => (
        <div className="max-w-[400px] truncate">{row.original.message}</div>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className={`inline-block px-2 py-1 rounded-full text-xs ${
          row.original.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500" : 
          row.original.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500" : 
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
        }`}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </div>
      )
    },
    {
      accessorKey: "response",
      header: "Response",
      cell: ({ row }) => (
        <div className="max-w-[400px] truncate">
          {row.original.response || "Awaiting response"}
        </div>
      )
    }
  ];

  const staffColumns: ColumnDef<Complaint>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString()
    },
    {
      accessorKey: "studentName",
      header: "Student",
    },
    {
      accessorKey: "message",
      header: "Complaint",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.original.message}</div>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className={`inline-block px-2 py-1 rounded-full text-xs ${
          row.original.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500" : 
          row.original.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500" : 
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
        }`}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </div>
      )
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
            {isResolved ? "Resolved" : row.original.response ? "Update" : "Respond"}
          </Button>
        );
      }
    }
  ];

  const columns = user?.role === "student" ? studentColumns : staffColumns;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Complaints</h1>
          <p className="text-muted-foreground">
            {user?.role === "student" 
              ? "Submit and track your complaints" 
              : "View and respond to student complaints"}
          </p>
        </div>
        {user?.role === "student" && (
          <Dialog open={isComplaintDialogOpen} onOpenChange={setIsComplaintDialogOpen}>
            <DialogTrigger asChild>
              <Button>Submit New Complaint</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a Complaint</DialogTitle>
                <DialogDescription>
                  Describe your issue in detail. Hostel staff will respond as soon as possible.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="complaint">Complaint Details</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Describe your issue..."
                    value={newComplaint}
                    onChange={(e) => setNewComplaint(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComplaintDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitComplaint}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredComplaints}
        searchKey="message"
        placeholder="Search complaints..."
      />

      {/* Response Dialog for Staff/Admin */}
      {(user?.role === "staff" || user?.role === "admin") && (
        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Respond to Complaint</DialogTitle>
              <DialogDescription>
                Provide a response to the student's complaint.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Complaint</Label>
                <div className="border rounded-md p-3 bg-muted/50">
                  <p>{selectedComplaint?.message}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    By {selectedComplaint?.studentName} on {selectedComplaint?.date ? new Date(selectedComplaint.date).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  placeholder="Enter your response..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitResponse}>Submit Response</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
