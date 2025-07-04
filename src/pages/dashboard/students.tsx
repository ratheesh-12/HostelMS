
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, UserPlus, Search, FileText } from "lucide-react";

// Mock student data
const mockStudents = [
  {
    id: "student1",
    name: "John Student",
    email: "student@hostel.com",
    room: "102",
    hostel: "Sunrise Hostel",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=student"
  },
  {
    id: "student2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    room: "205",
    hostel: "Maple Residence",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=sarah"
  },
  {
    id: "student3",
    name: "Michael Chen",
    email: "michael@example.com",
    room: "301",
    hostel: "Horizon Heights",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=michael"
  },
  {
    id: "student4",
    name: "Lisa Anderson",
    email: "lisa@example.com",
    room: "110",
    hostel: "Sunrise Hostel",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=lisa"
  }
];

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    room: "",
    hostel: ""
  });

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.room.includes(searchQuery) ||
    student.hostel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    // Validate form
    if (!newStudent.name || !newStudent.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Add new student
    const studentId = `student${students.length + 1}`;
    const newStudentData = {
      id: studentId,
      ...newStudent,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${studentId}`
    };
    
    setStudents([...students, newStudentData]);
    setIsAddDialogOpen(false);
    setNewStudent({ name: "", email: "", room: "", hostel: "" });
    toast.success("Student added successfully");
  };

  // Restrict access to staff and admin
  if (user?.role !== "staff" && user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Students Management</h1>
          <p className="text-muted-foreground text-center max-w-md">
            This section is only available for staff and administrators.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          Manage student accounts and information
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9" 
            placeholder="Search students..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Create a new student account and assign temporary credentials.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <Input 
                  id="name" 
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="Enter student's full name" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input 
                  id="email" 
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="Enter student's email" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="hostel">Hostel</label>
                  <Input 
                    id="hostel" 
                    value={newStudent.hostel}
                    onChange={(e) => setNewStudent({...newStudent, hostel: e.target.value})}
                    placeholder="Assign hostel" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="room">Room Number</label>
                  <Input 
                    id="room" 
                    value={newStudent.room}
                    onChange={(e) => setNewStudent({...newStudent, room: e.target.value})}
                    placeholder="Assign room" 
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent}>
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Card key={student.id}>
              <CardHeader className="pb-3 flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription>{student.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Hostel</p>
                    <p className="font-medium">{student.hostel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Room</p>
                    <p className="font-medium">{student.room}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Student ID</p>
                    <p className="font-medium">{student.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <div className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                      Active
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">Manage</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-muted/50 rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">No Students Found</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              No students match your search criteria.
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
