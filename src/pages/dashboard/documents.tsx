
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, X, Check, AlertTriangle, Clock } from "lucide-react";

type Document = {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  uploadDate: string;
  fileSize: string;
};

export default function DocumentsPage() {
  const { user } = useAuth();
  
  // Mock student documents data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc1",
      name: "Student ID Card",
      type: "Identity",
      status: "approved",
      uploadDate: "2023-01-15",
      fileSize: "1.2 MB"
    },
    {
      id: "doc2",
      name: "Address Proof",
      type: "Address",
      status: "pending",
      uploadDate: "2023-02-20",
      fileSize: "2.5 MB"
    },
    {
      id: "doc3",
      name: "Medical Certificate",
      type: "Medical",
      status: "rejected",
      uploadDate: "2023-03-05",
      fileSize: "1.8 MB"
    }
  ]);

  const handleUpload = () => {
    // In a real application, this would open a file picker and upload the file
    toast.success("Document uploaded successfully");
    
    // Mock adding a new document
    const newDocument: Document = {
      id: `doc${documents.length + 1}`,
      name: "New Document",
      type: "Other",
      status: "pending",
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: "0.5 MB"
    };
    
    setDocuments([...documents, newDocument]);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document deleted successfully");
  };

  // Show appropriate interface based on user role
  if (user?.role !== "student") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Document Management</h1>
          <p className="text-muted-foreground text-center max-w-md">
            This section is only available for students to manage their documents.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Documents</h1>
          <p className="text-muted-foreground">
            Upload and manage your important documents
          </p>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{doc.name}</CardTitle>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
                  doc.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500" : 
                  doc.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500" : 
                  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                }`}>
                  {doc.status === "approved" ? (
                    <Check className="mr-1 h-3 w-3" />
                  ) : doc.status === "rejected" ? (
                    <X className="mr-1 h-3 w-3" />
                  ) : (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  <span className="capitalize">{doc.status}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6 bg-muted rounded-md">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p>{doc.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p>{doc.fileSize}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p>{new Date(doc.uploadDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {doc.status === "rejected" && (
                <div className="mt-4 p-2 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-400 rounded-md text-sm flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <p>This document was rejected. Please upload a clearer version.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(doc.id)}
                disabled={doc.status === "approved"}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
