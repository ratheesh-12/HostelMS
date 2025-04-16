
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  avatar?: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'triple' | 'quad';
  status: 'available' | 'occupied' | 'maintenance';
  price: number;
  hostelId: string;
}

export interface Hostel {
  id: string;
  name: string;
  location: string;
  totalRooms: number;
  availableRooms: number;
  image?: string;
}

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  roomId: string;
  roomNumber: string;
  hostelId: string;
  hostelName: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  bookingDate: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  message: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  response?: string;
  status: 'pending' | 'in-progress' | 'resolved';
  staffId?: string;
  staffName?: string;
  date: string;
  verificationDate?: string;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetUser?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Document {
  id: string;
  studentId: string;
  name: string;
  type: string;
  fileUrl: string;
  fileSize: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}
