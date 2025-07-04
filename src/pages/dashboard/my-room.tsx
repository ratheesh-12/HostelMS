
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Calendar, CreditCard, MapPin, Users } from "lucide-react";

const roomImages = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
];

export default function MyRoomPage() {
  const { user } = useAuth();
  const { bookings, rooms, hostels } = useData();
  
  // Find booking for the current student
  const studentBooking = bookings.find(
    (booking) => booking.studentId === user?.id
  );
  
  // Get room details
  const roomDetails = studentBooking ? 
    rooms.find(r => r.id === studentBooking.roomId) : null;
  
  // Get hostel details
  const hostelDetails = roomDetails && studentBooking ? 
    hostels.find(h => h.id === studentBooking.hostelId) : null;
  
  // Determine room image based on room type
  const getRoomImage = (type?: string) => {
    switch(type) {
      case "single": return roomImages[0];
      case "double": return roomImages[1];
      case "triple":
      case "quad": return roomImages[2];
      default: return roomImages[0];
    }
  };

  // Show appropriate content based on user role
  if (user?.role !== "student") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <BedDouble className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Room Information</h1>
          <p className="text-muted-foreground text-center max-w-md">
            This section is only available for students to view their room details.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Room</h1>
        <p className="text-muted-foreground">
          View your hostel and room details
        </p>
      </div>

      {studentBooking ? (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">
                    Room {roomDetails?.number}
                  </CardTitle>
                  <Badge variant={
                    studentBooking.status === "approved" ? "default" :
                    studentBooking.status === "pending" ? "secondary" :
                    "destructive"
                  }>
                    {studentBooking.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg overflow-hidden h-64 md:h-80 bg-muted">
                  <img
                    src={getRoomImage(roomDetails?.type)}
                    alt="Room"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Room Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <BedDouble className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Room Type</p>
                        <p className="font-medium capitalize">{roomDetails?.type || "Standard"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Hostel</p>
                        <p className="font-medium">{hostelDetails?.name || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Booking Date</p>
                        <p className="font-medium">{new Date(studentBooking.bookingDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Yearly Fee</p>
                        <p className="font-medium">₹{roomDetails?.price || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Hostel Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{hostelDetails?.location || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Rooms</p>
                        <p className="font-medium">{hostelDetails?.totalRooms || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Room Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Bed with mattress</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Study table and chair</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Wardrobe</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Bookshelf</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span>High-speed Wi-Fi</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span>24/7 electricity with backup</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Air conditioning</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span>Attached bathroom (shared for double)</span>
                </li>
              </ul>

              <div className="mt-8">
                <h4 className="font-medium mb-3">Hostel Rules</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-2 mt-1.5"></span>
                    <span>Visitors allowed only in common areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-2 mt-1.5"></span>
                    <span>Quiet hours from 10 PM to 6 AM</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mr-2 mt-1.5"></span>
                    <span>No smoking or alcohol on premises</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full mt-8" variant="outline">
                Download Room Agreement
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-muted/50 rounded-lg p-6">
          <BedDouble className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Room Assigned</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You haven't been assigned a room yet. Please contact the hostel administration for assistance.
          </p>
          <Button>Request Room Assignment</Button>
        </div>
      )}
    </DashboardLayout>
  );
}
