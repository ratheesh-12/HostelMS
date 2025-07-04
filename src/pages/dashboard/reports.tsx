
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useData } from "@/contexts/data-context";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Download, FileText, Filter } from "lucide-react";
import { toast } from "sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

export default function ReportsPage() {
  const { user } = useAuth();
  const { hostels, rooms, complaints } = useData();
  
  const [reportType, setReportType] = useState("room-occupancy");
  const [timeFrame, setTimeFrame] = useState("all");
  const [hostelFilter, setHostelFilter] = useState("all");

  // Generate room occupancy data
  const generateRoomOccupancyData = () => {
    const data = hostels.map(hostel => {
      const hostelRooms = rooms.filter(room => room.hostelId === hostel.id);
      const occupied = hostelRooms.filter(room => room.status === "occupied").length;
      const available = hostelRooms.filter(room => room.status === "available").length;
      const maintenance = hostelRooms.filter(room => room.status === "maintenance").length;
      
      return {
        name: hostel.name,
        occupied,
        available,
        maintenance,
      };
    });
    
    return data;
  };

  // Generate room types data
  const generateRoomTypesData = () => {
    const roomTypes = ["single", "double", "triple", "quad"];
    const filteredRooms = hostelFilter === "all" 
      ? rooms 
      : rooms.filter(room => room.hostelId === hostelFilter);
    
    const data = roomTypes.map(type => {
      const count = filteredRooms.filter(room => room.type === type).length;
      return { name: type, value: count };
    });
    
    return data;
  };

  // Generate complaints data
  const generateComplaintsData = () => {
    const statusCount = {
      pending: complaints.filter(c => c.status === "pending").length,
      "in-progress": complaints.filter(c => c.status === "in-progress").length,
      resolved: complaints.filter(c => c.status === "resolved").length
    };
    
    return [
      { name: "Pending", value: statusCount.pending },
      { name: "In Progress", value: statusCount["in-progress"] },
      { name: "Resolved", value: statusCount.resolved }
    ];
  };

  const handleExportPDF = () => {
    toast.success("Report exported as PDF");
  };

  const handleExportCSV = () => {
    toast.success("Report exported as CSV");
  };

  // Restrict access to admin only
  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground text-center max-w-md">
            This section is only available for administrators.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download various reports
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Card className="w-full">
          <CardContent className="flex flex-col sm:flex-row gap-4 pt-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room-occupancy">Room Occupancy</SelectItem>
                  <SelectItem value="room-types">Room Types</SelectItem>
                  <SelectItem value="complaints">Complaints Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Time Frame</label>
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Hostel</label>
              <Select value={hostelFilter} onValueChange={setHostelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hostel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hostels</SelectItem>
                  {hostels.map(hostel => (
                    <SelectItem key={hostel.id} value={hostel.id}>
                      {hostel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-none self-end">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">
            {reportType === "room-occupancy" && "Room Occupancy Report"}
            {reportType === "room-types" && "Room Types Distribution"}
            {reportType === "complaints" && "Complaints Status Report"}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="default" size="sm" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            {reportType === "room-occupancy" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={generateRoomOccupancyData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="occupied" fill="#FF8042" name="Occupied" />
                  <Bar dataKey="available" fill="#00C49F" name="Available" />
                  <Bar dataKey="maintenance" fill="#FFBB28" name="Maintenance" />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {reportType === "room-types" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={generateRoomTypesData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {generateRoomTypesData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {reportType === "complaints" && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={generateComplaintsData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {generateComplaintsData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Room Occupancy Report</p>
                  <p className="text-sm text-muted-foreground">Generated on April 15, 2023</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Monthly Complaints Summary</p>
                  <p className="text-sm text-muted-foreground">Generated on April 10, 2023</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Student Occupancy Stats</p>
                  <p className="text-sm text-muted-foreground">Generated on April 5, 2023</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
