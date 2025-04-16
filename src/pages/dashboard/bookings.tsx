
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Booking, Room, Hostel } from "@/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Check, 
  FileText, 
  X 
} from "lucide-react";

export default function BookingsPage() {
  const { user } = useAuth();
  const { bookings, updateBooking, rooms, hostels } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"approved" | "rejected" | "pending">("pending");

  // Filter bookings based on user role
  const filteredBookings = user?.role === "student"
    ? bookings.filter(b => b.studentId === user.id)
    : bookings;

  const handleStatusChange = () => {
    if (!selectedBooking) return;
    
    updateBooking(selectedBooking.id, {
      status: bookingStatus
    });
    
    toast.success(`Booking ${bookingStatus}`);
    setIsDialogOpen(false);
  };

  // Define columns for bookings table
  const studentColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: "hostelName",
      header: "Hostel",
    },
    {
      accessorKey: "roomNumber",
      header: "Room",
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ row }) => new Date(row.original.bookingDate).toLocaleDateString()
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className={`inline-block px-2 py-1 rounded-full text-xs ${
          row.original.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500" : 
          row.original.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500" : 
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
        }`}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </div>
      )
    }
  ];

  const adminStaffColumns: ColumnDef<Booking>[] = [
    {
      accessorKey: "studentName",
      header: "Student",
    },
    {
      accessorKey: "hostelName",
      header: "Hostel",
    },
    {
      accessorKey: "roomNumber",
      header: "Room",
    },
    {
      accessorKey: "bookingDate",
      header: "Booking Date",
      cell: ({ row }) => new Date(row.original.bookingDate).toLocaleDateString()
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className={`inline-block px-2 py-1 rounded-full text-xs ${
          row.original.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500" : 
          row.original.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500" : 
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
        }`}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </div>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isActionable = row.original.status === "pending";
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!isActionable}
              onClick={() => {
                setSelectedBooking(row.original);
                setBookingStatus("approved");
                setIsDialogOpen(true);
              }}
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!isActionable}
              onClick={() => {
                setSelectedBooking(row.original);
                setBookingStatus("rejected");
                setIsDialogOpen(true);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        );
      }
    }
  ];

  const columns = user?.role === "student" ? studentColumns : adminStaffColumns;

  // Restrict access to authorized roles
  if (user?.role !== "admin" && user?.role !== "staff" && user?.role !== "student") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Bookings</h1>
          <p className="text-muted-foreground text-center max-w-md">
            You don't have permission to access this page.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            {user?.role === "student" 
              ? "View your room booking status" 
              : "Manage student room bookings"}
          </p>
        </div>
        {(user?.role === "admin" || user?.role === "staff") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Booking</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="student">Student</label>
                  <Input id="student" placeholder="Search for student" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="hostel">Hostel</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hostel" />
                    </SelectTrigger>
                    <SelectContent>
                      {hostels.map((hostel) => (
                        <SelectItem key={hostel.id} value={hostel.id}>
                          {hostel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="room">Room</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms
                        .filter(room => room.status === "available")
                        .map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            Room {room.number} ({room.type})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Booking</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={filteredBookings}
        searchKey="studentName" 
        placeholder="Search bookings..." 
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bookingStatus === "approved" ? "Approve Booking" : "Reject Booking"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to {bookingStatus === "approved" ? "approve" : "reject"} 
              the booking for student <span className="font-medium">{selectedBooking?.studentName}</span>?
            </p>
            {bookingStatus === "rejected" && (
              <div className="mt-4 space-y-2">
                <label htmlFor="reason">Reason for rejection</label>
                <Input id="reason" placeholder="Enter reason for rejection" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={bookingStatus === "approved" ? "default" : "destructive"}
              onClick={handleStatusChange}
            >
              {bookingStatus === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
