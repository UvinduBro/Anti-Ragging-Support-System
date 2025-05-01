import { useState } from "react";
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from "./StatusBadge";

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
  onUpdate: () => void;
}

const ReportDetailsModal = ({ isOpen, onClose, report, onUpdate }: ReportDetailsModalProps) => {
  const [status, setStatus] = useState(report?.status || "pending");
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  if (!isOpen || !report) return null;
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    
    const date = timestamp instanceof Timestamp 
      ? timestamp.toDate() 
      : new Date(timestamp);
      
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  const handleStatusUpdate = async () => {
    if (status === report.status) return;
    
    try {
      setIsUpdating(true);
      const db = getFirebaseFirestore();
      const reportRef = doc(db, "reports", report.id);
      
      await updateDoc(reportRef, {
        status,
        updatedAt: Timestamp.now()
      });
      
      onUpdate();
      toast({
        title: "Status updated",
        description: `Report status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating the status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleAddNote = async () => {
    if (!note.trim()) return;
    
    try {
      setIsUpdating(true);
      const db = getFirebaseFirestore();
      const reportRef = doc(db, "reports", report.id);
      
      await updateDoc(reportRef, {
        notes: arrayUnion({
          text: note,
          timestamp: Timestamp.now()
        }),
        updatedAt: Timestamp.now()
      });
      
      setNote("");
      onUpdate();
      toast({
        title: "Note added",
        description: "Your note has been added to the report",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Failed to add note",
        description: "There was an error adding your note",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-neutral-200 p-4">
          <h2 className="text-xl font-medium text-primary">Report Details</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
            aria-label="Close"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-neutral-300">Report ID</p>
              <p className="font-medium">#{report.id}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-300">Reported On</p>
              <p className="font-medium">{formatDate(report.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-300">Incident Type</p>
              <p className="font-medium">{report.incidentType}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-300">Incident Date/Time</p>
              <p className="font-medium">
                {report.date} {report.time ? `at ${report.time}` : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-300">Location</p>
              <p className="font-medium">{report.location}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-300">Status</p>
              <div className="mt-1">
                <StatusBadge status={report.status} />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-neutral-300 mb-1">Description</p>
            <div className="p-3 bg-neutral-100 rounded-md">
              {report.description}
            </div>
          </div>
          
          {report.contactName && report.contactEmail && (
            <div className="mb-6 p-3 border border-primary border-dashed rounded-md bg-blue-50">
              <h3 className="font-medium text-primary mb-2">Contact Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-300">Name</p>
                  <p className="font-medium">{report.contactName}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-300">Email</p>
                  <p className="font-medium">{report.contactEmail}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Status Update Form */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Update Status</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">Pending</option>
                <option value="under-review">Under Review</option>
                <option value="resolved">Resolved</option>
              </select>
              <button 
                onClick={handleStatusUpdate}
                disabled={isUpdating || status === report.status}
                className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
          
          {/* Notes Section */}
          {report.notes && report.notes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Notes</h3>
              <div className="space-y-3">
                {report.notes.map((note: any, index: number) => (
                  <div key={index} className="p-3 bg-neutral-100 rounded-md">
                    <p>{note.text}</p>
                    <p className="text-xs text-neutral-300 mt-1">{formatDate(note.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Add Note Form */}
          <div>
            <h3 className="font-medium mb-2">Add Note</h3>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-3" 
              rows={3} 
              placeholder="Add private notes about actions taken..."
            ></textarea>
            <button 
              onClick={handleAddNote}
              disabled={isUpdating || !note.trim()}
              className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
