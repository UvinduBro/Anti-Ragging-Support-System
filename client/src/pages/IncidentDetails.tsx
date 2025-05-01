import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, ZoomIn } from "lucide-react";
import apiRequest from "@/api";
import { Helmet } from "react-helmet";

type Incident = {
  id: string;
  incidentType: string;
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

export default function IncidentDetails() {
  const params = useParams();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await apiRequest("GET", `/api/incidents/${params.id}`);
        setIncident(res.data);
      } catch (error) {
        console.error("Error fetching incident:", error);
      }
    };

    fetchIncident();
  }, [params.id]);

  if (!incident) {
    return <div>Loading...</div>;
  }

  const shareTitle = `Incident Report: ${incident.incidentType}`;
  const shareDescription = incident.description;
  const shareLocation = incident.location;
  const shareUrl = window.location.href;
  const shareHashtags = "#AntiRagging #StudentSafety";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Helmet>
        <title>{shareTitle}</title>
        <meta name="description" content={shareDescription} />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={shareDescription} />
      </Helmet>

      <div className="flex justify-between items-center">
        <Link href="/incidents">
          <Button variant="outline">← Back to Incidents</Button>
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}`;
              window.open(url, "_blank");
            }}
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              const text = `${shareTitle}\n\n${shareDescription}\n\nLocation: ${shareLocation}\n\n${shareHashtags}`;
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                text
              )}&url=${encodeURIComponent(shareUrl)}`;
              window.open(url, "_blank");
            }}
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              const summary = `${shareDescription}\n\nLocation: ${shareLocation}\n\n${shareHashtags}`;
              const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                shareUrl
              )}&title=${encodeURIComponent(
                shareTitle
              )}&summary=${encodeURIComponent(summary)}`;
              window.open(url, "_blank");
            }}
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {incident.incidentType.charAt(0).toUpperCase() +
                incident.incidentType.slice(1)}
            </h1>
            <p className="text-sm text-neutral-500">
              {incident.date} • {incident.location}
            </p>
          </div>
          <Badge
            className={
              incident.status === "resolved"
                ? "bg-green-100 text-green-800"
                : incident.status === "under-review"
                ? "bg-orange-100 text-orange-800"
                : "bg-red-100 text-red-800"
            }
          >
            {incident.status === "resolved"
              ? "Resolved"
              : incident.status === "under-review"
              ? "Under Review"
              : "Pending"}
          </Badge>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">Description</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            {incident.description}
          </p>
        </div>

        {incident.contactName && (
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Contact Information</h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              {incident.contactName}
              {incident.contactEmail && ` (${incident.contactEmail})`}
            </p>
          </div>
        )}

        {incident.mediaBase64 && incident.mediaBase64.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Attached Media</h2>
            <div className="grid grid-cols-2 gap-4">
              {incident.mediaBase64.map((media, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(media)}
                >
                  <img
                    src={media}
                    alt={`Media ${index + 1}`}
                    className="rounded-lg object-cover h-48 w-full"
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
    </div>
  );
}
