
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
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  MessageSquare,
  Plus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ComplaintsPage() {
  const { user } = useAuth();
  const { complaints, updateComplaint, addComplaint } = useData();
  
  // For new complaint form
  const [newComplaint, setNewComplaint] = useState("");
  const [complaintCategory, setComplaintCategory] = useState("maintenance");
  const [complaintPriority, setComplaintPriority] = useState<"low" | "medium" | "high">("medium");
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  
  // For response form
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<"pending" | "in-progress" | "resolved">("in-progress");
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  
  // For filtering
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter complaints based on user role and filters
  const getFilteredComplaints = () => {
    let filtered = user?.role === "student"
      ? complaints.filter(c => c.studentId === user.id)
      : complaints;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(c => c.category === categoryFilter);
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
      priority: complaintPriority,
      status: "pending" as "pending" | "in-progress" | "resolved",
      date: new Date().toISOString()
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
      verificationDate: new Date().toISOString()
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
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString()
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category || "General"}</span>
      )
    },
    {
      accessorKey: "message",
      header: "Complaint",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.original.message}</div>
      )
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <Badge variant={
          row.original.priority === "high" ? "destructive" :
          row.original.priority === "medium" ? "default" :
          "outline"
        }>
          {row.original.priority ? row.original.priority.toUpperCase() : "NORMAL"}
        </Badge>
      )
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
          <div className={`inline-block px-2 py-1 rounded-full text-xs ${
            row.original.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500" : 
            row.original.status === "in-progress" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500" : 
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
          }`}>
            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          </div>
        </div>
      )
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category || "General"}</span>
      )
    },
    {
      accessorKey: "message",
      header: "Complaint",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">{row.original.message}</div>
      )
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <Badge variant={
          row.original.priority === "high" ? "destructive" :
          row.original.priority === "medium" ? "default" :
          "outline"
        }>
          {row.original.priority ? row.original.priority.toUpperCase() : "NORMAL"}
        </Badge>
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
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Submit New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a Complaint</DialogTitle>
                <DialogDescription>
                  Describe your issue in detail. Hostel staff will respond as soon as possible.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={complaintCategory} onValueChange={setComplaintCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="internet">Internet</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={complaintPriority} onValueChange={(value) => setComplaintPriority(value as "low" | "medium" | "high")}>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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

      <div className="mb-6">
        <Tabs defaultValue="all" onValueChange={(value) => setStatusFilter(value === "all" ? "all" : value)}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="internet">Internet</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-6">
            <DataTable
              columns={columns}
              data={filteredComplaints}
              searchKey="message"
              placeholder="Search complaints..."
            />
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <DataTable
              columns={columns}
              data={filteredComplaints.filter(c => c.status === "pending")}
              searchKey="message"
              placeholder="Search pending complaints..."
            />
          </TabsContent>
          
          <TabsContent value="in-progress" className="mt-6">
            <DataTable
              columns={columns}
              data={filteredComplaints.filter(c => c.status === "in-progress")}
              searchKey="message"
              placeholder="Search in-progress complaints..."
            />
          </TabsContent>
          
          <TabsContent value="resolved" className="mt-6">
            <DataTable
              columns={columns}
              data={filteredComplaints.filter(c => c.status === "resolved")}
              searchKey="message"
              placeholder="Search resolved complaints..."
            />
          </TabsContent>
        </Tabs>
      </div>

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
                  <div className="flex justify-between">
                    <p className="font-medium">{selectedComplaint?.studentName}</p>
                    <Badge variant={
                      selectedComplaint?.priority === "high" ? "destructive" :
                      selectedComplaint?.priority === "medium" ? "default" :
                      "outline"
                    }>
                      {selectedComplaint?.priority ? selectedComplaint?.priority.toUpperCase() : "NORMAL"}
                    </Badge>
                  </div>
                  <p className="mt-2">{selectedComplaint?.message}</p>
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <p>Category: <span className="capitalize">{selectedComplaint?.category || "General"}</span></p>
                    <p>
                      {selectedComplaint?.date ? new Date(selectedComplaint.date).toLocaleDateString() : ""}
                    </p>
                  </div>
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
                <Select value={status} onValueChange={(value) => setStatus(value as "in-progress" | "resolved")}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {status === "resolved" && (
                <div className="space-y-2">
                  <Label htmlFor="verification">Verification Details</Label>
                  <Textarea
                    id="verification"
                    placeholder="Enter verification details..."
                    rows={2}
                  />
                </div>
              )}
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
