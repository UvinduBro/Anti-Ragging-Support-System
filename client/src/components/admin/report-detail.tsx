import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  getStatusBadgeClass, 
  getStatusDisplayName, 
  formatDate, 
  formatTime, 
  formatDateTime, 
  getReportTypeName 
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ActionLogEntry, ReportData } from "@/lib/types";
import { Check, Clock, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/utils";

interface ReportDetailProps {
  report: ReportData | null;
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
}

export function ReportDetail({ report, isOpen, onClose, adminId }: ReportDetailProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionLogs, setActionLogs] = useState<ActionLogEntry[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (report) {
      setAdminNotes(report.adminNotes || "");
      fetchActionLogs(report.reportId);
    }
  }, [report]);

  const fetchActionLogs = async (reportId: string) => {
    try {
      const logs = await apiRequest<ActionLogEntry[]>("GET", `/api/reports/${reportId}/logs`);
      setActionLogs(logs);
    } catch (error) {
      console.error("Error fetching action logs:", error);
    }
  };

  const updateReportStatus = async (status: string) => {
    if (!report) return;
    
    setIsLoading(true);
    try {
      await apiRequest("PATCH", `/api/reports/${report.reportId}/status`, {
        status,
        adminId
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      
      toast({
        title: "Status updated",
        description: `Report status has been changed to ${getStatusDisplayName(status)}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update report status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportNotes = async () => {
    if (!report) return;
    
    setIsLoading(true);
    try {
      await apiRequest("PATCH", `/api/reports/${report.reportId}/notes`, {
        notes: adminNotes,
        adminId
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      
      toast({
        title: "Notes updated",
        description: "Admin notes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Report: {report.reportId}</span>
            <Badge className={getStatusBadgeClass(report.status)}>
              {getStatusDisplayName(report.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Manage and update this incident report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div>
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className={`${getStatusBadgeClass(report.status)} text-sm px-3 py-1`}>
                {getStatusDisplayName(report.status)}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300"
                onClick={() => updateReportStatus("pending")}
                disabled={isLoading || report.status === "pending"}
              >
                Mark Pending
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300"
                onClick={() => updateReportStatus("under_review")}
                disabled={isLoading || report.status === "under_review"}
              >
                Mark Under Review
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
                onClick={() => updateReportStatus("resolved")}
                disabled={isLoading || report.status === "resolved"}
              >
                Mark Resolved
              </Button>
            </div>
          </div>

          {/* Report Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Incident Type</h4>
              <p className="mt-1 font-medium">{getReportTypeName(report.type)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
              <p className="mt-1">{report.location}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Incident Date & Time</h4>
              <p className="mt-1">
                {formatDate(report.incidentDate)} at {formatTime(report.incidentTime)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Report Submitted</h4>
              <p className="mt-1">{formatDateTime(report.createdAt)}</p>
            </div>
          </div>
          
          {/* Optional Contact */}
          {report.optionalContact && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Optional Contact Information</h4>
              <p className="mt-1">{report.optionalContact}</p>
            </div>
          )}
          
          {/* Report Description */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
            <div className="bg-muted p-4 rounded-md">
              <p className="whitespace-pre-line">{report.description}</p>
            </div>
          </div>
          
          {/* Admin Notes */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Admin Notes</h4>
            <Textarea 
              value={adminNotes} 
              onChange={(e) => setAdminNotes(e.target.value)} 
              placeholder="Add internal notes about this report..."
              rows={3}
            />
            <Button 
              size="sm" 
              onClick={updateReportNotes} 
              disabled={isLoading}
              className="mt-2"
            >
              Save Notes
            </Button>
          </div>
          
          {/* Action History */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Action History</h4>
            <div className="border rounded-md divide-y">
              <div className="p-3 flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center">
                    <FileText className="text-white text-sm" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm">Report submitted anonymously</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(report.createdAt)}</p>
                </div>
              </div>
              
              {actionLogs.map((log) => (
                <div key={log.id} className="p-3 flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      log.action === "status_change" 
                        ? log.newValue.status === "under_review" 
                          ? "bg-blue-100" 
                          : log.newValue.status === "resolved" 
                            ? "bg-green-100" 
                            : "bg-yellow-100"
                        : "bg-neutral-100"
                    }`}>
                      {log.action === "status_change" ? (
                        log.newValue.status === "under_review" ? (
                          <Search className="text-blue-600 text-sm" />
                        ) : log.newValue.status === "resolved" ? (
                          <Check className="text-green-600 text-sm" />
                        ) : (
                          <Clock className="text-yellow-600 text-sm" />
                        )
                      ) : (
                        <FileText className="text-neutral-600 text-sm" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">
                      {log.action === "status_change" 
                        ? `Report marked as ${getStatusDisplayName(log.newValue.status)}`
                        : "Admin notes updated"}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={updateReportNotes} disabled={isLoading}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
