import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Search, X, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/api";

type Incident = {
  id: string;
  type: string;
  description: string;
  location: string;
  date: string;
  time?: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  contactName?: string;
  contactEmail?: string;
  optionalContact?: boolean;
  mediaBase64?: string[];
};

export default function Incidents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const getIncidents = async () => {
    try {
      const res = await apiRequest("GET", "/api/incidents");
      setIncidents(res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reports. Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getIncidents();
  }, []);

  // Uncomment and modify the section below if you need sample data during development
  /*
  const incidents: Incident[] = [
    {
      id: "INC-SAMPLE-001",
      type: "Verbal Harassment",
      description: "Sample incident description.",
      location: "University of Colombo",
      date: "Apr 28, 2025",
      status: "pending"
    }
  ];
  */

  const universities = [
    "University of Colombo",
    "University of Peradeniya",
    "University of Sri Jayewardenepura",
    "University of Kelaniya",
    "University of Moratuwa",
    "University of Jaffna",
    "University of Ruhuna",
    "Eastern University",
    "South Eastern University",
    "Rajarata University",
    "Sabaragamuwa University",
    "Wayamba University",
    "Uva Wellassa University",
    "University of the Visual & Performing Arts",
    "Other",
  ];

  const incidentTypes = [
    "Verbal Harassment",
    "Physical Ragging",
    "Cyberbullying",
    "Discrimination",
    "Rights Violation",
    "Sexual Harassment",
    "Other",
  ];

  // Filter incidents based on search and filters
  const filteredIncidents =
    incidents?.filter((incident) => {
      const matchesSearch =
        searchQuery === "" ||
        incident.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || incident.type === typeFilter;
      const matchesUniversity =
        universityFilter === "all" || incident.location === universityFilter;
      const matchesStatus =
        statusFilter === "all" || incident.status === statusFilter;

      return matchesSearch && matchesType && matchesUniversity && matchesStatus;
    }) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Incident Reports
        </h1>
        <Link href="/report">
          <Button className="bg-primary text-white">Report New Incident</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search by description, ID, or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-2/3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-1/3">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {incidentTypes.map((type, idx) => (
                    <SelectItem key={idx} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={universityFilter}
                onValueChange={setUniversityFilter}
              >
                <SelectTrigger className="w-full sm:w-1/3">
                  <SelectValue placeholder="Filter by university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map((uni, idx) => (
                    <SelectItem key={idx} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-1/3">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="mt-4">
        {filteredIncidents.length > 0 ? (
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card 
                key={incident.id} 
                className="overflow-hidden cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                onClick={() => setSelectedIncident(incident)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                            {incident.type}
                          </h3>
                          <p className="text-sm text-neutral-500">
                            {incident.date} • {incident.location}
                          </p>
                        </div>
                        <Badge
                          className={
                            incident.status === "resolved"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : incident.status === "under-review"
                              ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {incident.status === "resolved"
                            ? "Resolved"
                            : incident.status === "under-review"
                            ? "Under Review"
                            : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300 mt-2">
                        {incident.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-neutral-50">
              No incidents found
            </h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Incident Details Modal */}
      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
            <DialogDescription>
              Detailed information about the reported incident
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{selectedIncident.type}</h3>
                  <p className="text-sm text-neutral-500">
                    {selectedIncident.date} • {selectedIncident.location}
                  </p>
                </div>
                <Badge
                  className={
                    selectedIncident.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : selectedIncident.status === "under-review"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {selectedIncident.status === "resolved"
                    ? "Resolved"
                    : selectedIncident.status === "under-review"
                    ? "Under Review"
                    : "Pending"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {selectedIncident.description}
                </p>
              </div>

              {selectedIncident.contactName && (
                <div className="space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {selectedIncident.contactName}
                    {selectedIncident.contactEmail && ` (${selectedIncident.contactEmail})`}
                  </p>
                </div>
              )}

              {selectedIncident.mediaBase64 && selectedIncident.mediaBase64.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Attached Media</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIncident.mediaBase64.map((media, index) => (
                      <div 
                        key={index} 
                        className="relative group cursor-pointer"
                        onClick={() => setSelectedImage(media)}
                      >
                        <img
                          src={media}
                          alt={`Media ${index + 1}`}
                          className="rounded-lg object-cover h-32 w-full"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <ZoomIn className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0">
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full h-full object-contain max-h-[90vh]"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-blue-50 p-6 rounded-lg mt-6">
        <h2 className="text-lg font-medium text-blue-800 mb-2">
          Important Note
        </h2>
        <p className="text-sm text-blue-700">
          All incident reports are anonymous and handled with strict
          confidentiality. The details shown here have been anonymized to
          protect the identities of all parties involved.
        </p>
      </div>
    </div>
  );
}
