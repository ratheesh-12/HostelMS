
import React, { createContext, useContext, useState } from "react";
import { Hostel, Room, Booking, Complaint, ActivityLog, Notification } from "@/types";

// Mock data
const mockHostels: Hostel[] = [
  {
    id: "h1",
    name: "Sunrise Hostel",
    location: "North Campus",
    totalRooms: 50,
    availableRooms: 15,
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "h2",
    name: "Maple Residence",
    location: "South Campus",
    totalRooms: 75,
    availableRooms: 8,
    image: "https://images.unsplash.com/photo-1606046604972-77cc76aee944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "h3",
    name: "Horizon Heights",
    location: "West Campus",
    totalRooms: 30,
    availableRooms: 12,
    image: "https://images.unsplash.com/photo-1551133989-5f8c0c9956d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
];

const mockRooms: Room[] = [
  {
    id: "r1",
    number: "101",
    type: "single",
    status: "available",
    price: 5000,
    hostelId: "h1"
  },
  {
    id: "r2",
    number: "102",
    type: "double",
    status: "occupied",
    price: 3500,
    hostelId: "h1"
  },
  {
    id: "r3",
    number: "201",
    type: "single",
    status: "maintenance",
    price: 4800,
    hostelId: "h2"
  },
  {
    id: "r4",
    number: "202",
    type: "triple",
    status: "available",
    price: 3000,
    hostelId: "h2"
  },
  {
    id: "r5",
    number: "301",
    type: "quad",
    status: "available",
    price: 2500,
    hostelId: "h3"
  }
];

const mockBookings: Booking[] = [
  {
    id: "b1",
    studentId: "student1",
    studentName: "John Student",
    roomId: "r2",
    roomNumber: "102",
    hostelId: "h1",
    hostelName: "Sunrise Hostel",
    status: "approved",
    bookingDate: "2023-01-15"
  }
];

const mockComplaints: Complaint[] = [
  {
    id: "c1",
    studentId: "student1",
    studentName: "John Student",
    message: "Water heater not working in room 102",
    status: "pending",
    date: "2023-03-10"
  },
  {
    id: "c2",
    studentId: "student1",
    studentName: "John Student",
    message: "Wi-Fi connectivity issues",
    response: "Our technician will check the router today",
    status: "in-progress",
    staffId: "staff1",
    staffName: "Staff Member",
    date: "2023-02-20"
  }
];

const mockLogs: ActivityLog[] = [
  {
    id: "l1",
    adminId: "admin1",
    adminName: "Admin User",
    action: "Created new staff account",
    targetUser: "Staff Member",
    timestamp: "2023-01-05T10:30:00"
  },
  {
    id: "l2",
    adminId: "admin1",
    adminName: "Admin User",
    action: "Updated room status",
    targetUser: "Room 201",
    timestamp: "2023-02-15T14:45:00"
  }
];

const mockNotifications: Notification[] = [
  {
    id: "n1",
    userId: "student1",
    message: "Your booking has been approved",
    type: "success",
    read: false,
    createdAt: "2023-01-16T09:00:00"
  },
  {
    id: "n2",
    userId: "staff1",
    message: "New complaint assigned to you",
    type: "info",
    read: true,
    createdAt: "2023-02-21T11:30:00"
  },
  {
    id: "n3",
    userId: "admin1",
    message: "System maintenance scheduled",
    type: "warning",
    read: false,
    createdAt: "2023-03-01T16:00:00"
  }
];

interface DataContextType {
  hostels: Hostel[];
  rooms: Room[];
  bookings: Booking[];
  complaints: Complaint[];
  activityLogs: ActivityLog[];
  notifications: Notification[];
  addHostel: (hostel: Omit<Hostel, "id">) => void;
  updateHostel: (id: string, hostel: Partial<Hostel>) => void;
  deleteHostel: (id: string) => void;
  addRoom: (room: Omit<Room, "id">) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  addBooking: (booking: Omit<Booking, "id">) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  addComplaint: (complaint: Omit<Complaint, "id">) => void;
  updateComplaint: (id: string, complaint: Partial<Complaint>) => void;
  deleteComplaint: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  formatPrice: (price: number) => string;
}

const DataContext = createContext<DataContextType>({
  hostels: [],
  rooms: [],
  bookings: [],
  complaints: [],
  activityLogs: [],
  notifications: [],
  addHostel: () => {},
  updateHostel: () => {},
  deleteHostel: () => {},
  addRoom: () => {},
  updateRoom: () => {},
  deleteRoom: () => {},
  addBooking: () => {},
  updateBooking: () => {},
  deleteBooking: () => {},
  addComplaint: () => {},
  updateComplaint: () => {},
  deleteComplaint: () => {},
  markNotificationAsRead: () => {},
  formatPrice: () => ""
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hostels, setHostels] = useState<Hostel[]>(mockHostels);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [activityLogs] = useState<ActivityLog[]>(mockLogs);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Format price in Rupees
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Hostel operations
  const addHostel = (hostel: Omit<Hostel, "id">) => {
    const newHostel = {
      ...hostel,
      id: `h${hostels.length + 1}`
    };
    setHostels([...hostels, newHostel]);
  };

  const updateHostel = (id: string, hostel: Partial<Hostel>) => {
    setHostels(hostels.map(h => h.id === id ? { ...h, ...hostel } : h));
  };

  const deleteHostel = (id: string) => {
    setHostels(hostels.filter(h => h.id !== id));
  };

  // Room operations
  const addRoom = (room: Omit<Room, "id">) => {
    const newRoom = {
      ...room,
      id: `r${rooms.length + 1}`
    };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (id: string, room: Partial<Room>) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ...room } : r));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  // Booking operations
  const addBooking = (booking: Omit<Booking, "id">) => {
    const newBooking = {
      ...booking,
      id: `b${bookings.length + 1}`
    };
    setBookings([...bookings, newBooking]);
  };

  const updateBooking = (id: string, booking: Partial<Booking>) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, ...booking } : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  // Complaint operations
  const addComplaint = (complaint: Omit<Complaint, "id">) => {
    const newComplaint = {
      ...complaint,
      id: `c${complaints.length + 1}`
    };
    setComplaints([...complaints, newComplaint]);
  };

  const updateComplaint = (id: string, complaint: Partial<Complaint>) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, ...complaint } : c));
  };

  const deleteComplaint = (id: string) => {
    setComplaints(complaints.filter(c => c.id !== id));
  };

  // Notification operations
  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <DataContext.Provider 
      value={{ 
        hostels, 
        rooms, 
        bookings, 
        complaints, 
        activityLogs, 
        notifications,
        addHostel,
        updateHostel,
        deleteHostel,
        addRoom,
        updateRoom,
        deleteRoom,
        addBooking,
        updateBooking,
        deleteBooking,
        addComplaint,
        updateComplaint,
        deleteComplaint,
        markNotificationAsRead,
        formatPrice
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
