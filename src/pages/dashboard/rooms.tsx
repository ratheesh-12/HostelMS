import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useData } from "@/contexts/data-context";
import { useAuth } from "@/contexts/auth-context";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Plus, Edit, Trash } from "lucide-react";

export default function RoomsPage() {
  const { user } = useAuth();
  const { hostels, rooms, addRoom, updateRoom, deleteRoom } = useData();
  const [selectedHostel, setSelectedHostel] = useState<string | "all">("all");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: "",
    type: "triple" as "triple" | "quad" | "quintuple" | "sextuple",
    status: "available" as "available" | "occupied" | "maintenance",
    price: 75000, // Assuming yearly price in INR
    hostelId: hostels[0]?.id || ""
  });

  // Filter rooms based on selected hostel
  const filteredRooms = selectedHostel === "all" 
    ? rooms 
    : rooms.filter(room => room.hostelId === selectedHostel);

  const handleAddRoom = () => {
    addRoom(newRoom);
    setNewRoom({
      number: "",
      type: "triple",
      status: "available",
      price: 75000, // Reset to default yearly price
      hostelId: hostels[0]?.id || ""
    });
    setIsAddRoomOpen(false);
  };

  const handleStatusUpdate = (roomId: string, newStatus: "available" | "occupied" | "maintenance") => {
    updateRoom(roomId, { status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "occupied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
      case "maintenance":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case "triple":
        return "🛏️🛏️🛏️";
      case "quad":
        return "🛏️🛏️🛏️🛏️";
      case "quintuple ":
        return "🛏️🛏️🛏️🛏️🛏️";
      case "sextuple":
        return "🛏️🛏️🛏️🛏️🛏️🛏️";
      default:
        return "🛏️🛏️🛏️";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rooms Management</h1>
          <p className="text-muted-foreground">
            {user?.role === "admin" 
              ? "Manage all hostel rooms" 
              : "View and assign rooms to students"}
          </p>
        </div>
        {user?.role === "admin" && (
          <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
                <DialogDescription>
                  Create a new room in one of your hostels.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="hostel">Hostel</Label>
                  <Select
                    value={newRoom.hostelId}
                    onValueChange={(value) => setNewRoom({ ...newRoom, hostelId: value })}
                  >
                    <SelectTrigger id="hostel">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="number">Room Number</Label>
                    <Input
                      id="number"
                      value={newRoom.number}
                      onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                      placeholder="e.g., 101"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Yearly Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newRoom.price}
                      onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
                      placeholder="75000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Room Type</Label>
                    <Select
                      value={newRoom.type}
                      onValueChange={(value: "triple" | "quad" | "quintuple" | "sextuple") => setNewRoom({ ...newRoom, type: value })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="triple">Triple</SelectItem>
                        <SelectItem value="quad">Quad</SelectItem>
                        <SelectItem value="quintuple">Quintuple</SelectItem>
                        <SelectItem value="sextuple">Sextuple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <Select
                      value={newRoom.status}
                      onValueChange={(value: "available" | "occupied" | "maintenance") => setNewRoom({ ...newRoom, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>Cancel</Button>
                <Button onClick={handleAddRoom}>Add Room</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Label htmlFor="filter-hostel" className="min-w-[80px]">Filter by:</Label>
          <Select
            value={selectedHostel}
            onValueChange={setSelectedHostel}
          >
            <SelectTrigger id="filter-hostel" className="w-[200px]">
              <SelectValue placeholder="Select hostel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hostels</SelectItem>
              {hostels.map((hostel) => (
                <SelectItem key={hostel.id} value={hostel.id}>
                  {hostel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <BedDouble className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No rooms found</h3>
            <p className="text-muted-foreground">
              {selectedHostel === "all"
                ? "There are no rooms available in any hostel."
                : "There are no rooms available in the selected hostel."}
            </p>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const hostel = hostels.find(h => h.id === room.hostelId);
            return (
              <Card key={room.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Room {room.number}</CardTitle>
                      <CardDescription>
                        {hostel?.name}, {hostel?.location}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(room.status)}>
                      {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize flex items-center">
                        {getRoomTypeIcon(room.type)} {room.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">₹{room.price}/Year</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 justify-between">
                  {user?.role === "admin" ? (
                    <>
                      <Select
                        defaultValue={room.status}
                        onValueChange={(value: "available" | "occupied" | "maintenance") => handleStatusUpdate(room.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full"
                      disabled={room.status !== "available"}
                    >
                      {room.status === "available" ? "Assign Room" : "Unavailable"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
