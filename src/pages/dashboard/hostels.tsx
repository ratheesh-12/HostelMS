
import { useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useData } from "@/contexts/data-context";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Plus, Edit, Trash, MapPin } from "lucide-react";

export default function HostelsPage() {
  const { hostels, rooms, addHostel, updateHostel, deleteHostel } = useData();
  const [isAddHostelOpen, setIsAddHostelOpen] = useState(false);
  const [newHostel, setNewHostel] = useState({
    name: "",
    location: "",
    totalRooms: 0,
    availableRooms: 0,
    image: ""
  });

  const handleAddHostel = () => {
    addHostel(newHostel);
    setNewHostel({
      name: "",
      location: "",
      totalRooms: 0,
      availableRooms: 0,
      image: ""
    });
    setIsAddHostelOpen(false);
  };

  // Count rooms by hostel
  const getRoomStats = (hostelId: string) => {
    const hostelRooms = rooms.filter(room => room.hostelId === hostelId);
    const available = hostelRooms.filter(room => room.status === "available").length;
    const occupied = hostelRooms.filter(room => room.status === "occupied").length;
    const maintenance = hostelRooms.filter(room => room.status === "maintenance").length;
    
    return {
      total: hostelRooms.length,
      available,
      occupied,
      maintenance
    };
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hostel Management</h1>
          <p className="text-muted-foreground">
            Manage all your hostel properties
          </p>
        </div>
        <Dialog open={isAddHostelOpen} onOpenChange={setIsAddHostelOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Hostel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Hostel</DialogTitle>
              <DialogDescription>
                Add a new hostel property to your management system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hostel Name</Label>
                <Input
                  id="name"
                  value={newHostel.name}
                  onChange={(e) => setNewHostel({ ...newHostel, name: e.target.value })}
                  placeholder="e.g., Sunrise Hostel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newHostel.location}
                  onChange={(e) => setNewHostel({ ...newHostel, location: e.target.value })}
                  placeholder="e.g., North Campus"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalRooms">Total Rooms</Label>
                  <Input
                    id="totalRooms"
                    type="number"
                    value={newHostel.totalRooms || ""}
                    onChange={(e) => setNewHostel({ ...newHostel, totalRooms: Number(e.target.value) })}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableRooms">Available Rooms</Label>
                  <Input
                    id="availableRooms"
                    type="number"
                    value={newHostel.availableRooms || ""}
                    onChange={(e) => setNewHostel({ ...newHostel, availableRooms: Number(e.target.value) })}
                    placeholder="15"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newHostel.image}
                  onChange={(e) => setNewHostel({ ...newHostel, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddHostelOpen(false)}>Cancel</Button>
              <Button onClick={handleAddHostel}>Add Hostel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hostels found</h3>
            <p className="text-muted-foreground">
              Click the "Add Hostel" button to create your first hostel property.
            </p>
          </div>
        ) : (
          hostels.map((hostel) => {
            const stats = getRoomStats(hostel.id);
            return (
              <Card key={hostel.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  {hostel.image ? (
                    <img
                      src={hostel.image}
                      alt={hostel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{hostel.name}</CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hostel.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Rooms</p>
                      <p className="font-medium">{stats.total}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="font-medium text-green-600 dark:text-green-400">{stats.available}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Occupied</p>
                      <p className="font-medium text-blue-600 dark:text-blue-400">{stats.occupied}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Maintenance</p>
                      <p className="font-medium text-amber-600 dark:text-amber-400">{stats.maintenance}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="text-red-500">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
