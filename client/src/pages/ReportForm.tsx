import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseFirestore, getFirebaseStorage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import SuccessModal from "@/components/SuccessModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileImage, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import apiRequest from "@/api";
import { ApiResponse } from "@/lib/types";



const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  incidentType: z.string({
    required_error: "Please select an incident type",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
  date: z.string({
    required_error: "Please select a date",
  }),
  time: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  optionalContact: z.boolean().default(false),
  contactName: z.string().optional(),
  contactEmail: z.string().optional().transform(val => val || null),
  contactPhone: z.string().optional().transform(val => val || null),
  mediaFiles: z.any().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const ReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidentType: "",
      location: "",
      date: "",
      time: "",
      description: "",
      optionalContact: false,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      mediaFiles: undefined,
    },
  });

  const showOptionalContact = form.watch("optionalContact");

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    const files = e.target.files;

    if (!files || files.length === 0) return;

    // Validate file types and sizes
    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setFileUploadError("Only images (JPEG, PNG, WebP) are accepted");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileUploadError("File size must be less than 5MB");
        return;
      }

      newFiles.push(file);
    }

    // Add the new files to selected files
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove file from selection
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert files to base64 if any
      let mediaBase64: string[] = [];
      if (selectedFiles.length > 0) {
        try {
          mediaBase64 = await Promise.all(selectedFiles.map(convertFileToBase64));
        } catch (error) {
          console.error("Error converting files to base64:", error);
          toast({
            title: "Error",
            description: "There was an error processing your images. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      const payload = {
        incidentType: data.incidentType,
        location: data.location,
        date: data.date,
        time: data.time || null,
        description: data.description,
        status: "pending",
        mediaBase64,
        optionalContact: data.optionalContact,
        contactName: data.optionalContact ? data.contactName : null,
        contactEmail: data.optionalContact ? data.contactEmail : null,
        contactPhone: data.optionalContact ? data.contactPhone : null
      };

      const res = (await apiRequest(
        "POST",
        "/api/incidents",
        payload
      )) as unknown as ApiResponse<any>;

      if (res.success) {
        setShowSuccess(true);
        form.reset();
        setSelectedFiles([]);
      } else {
        throw new Error(res.message || "Failed to submit report");
      }
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
  };

  return (
    <section className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-medium text-primary mb-4">
            Report an Incident
          </h1>
          <p className="mb-6">
            Use this form to anonymously report any incident of ragging or human
            rights violation. Your identity will remain protected.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="incidentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="verbal">
                          Verbal Harassment
                        </SelectItem>
                        <SelectItem value="physical">
                          Physical Harassment
                        </SelectItem>
                        <SelectItem value="bullying">Bullying</SelectItem>
                        <SelectItem value="rights-violation">
                          Rights Violation
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select university where incident occurred" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="University of Colombo">
                          University of Colombo
                        </SelectItem>
                        <SelectItem value="University of Peradeniya">
                          University of Peradeniya
                        </SelectItem>
                        <SelectItem value="University of Sri Jayewardenepura">
                          University of Sri Jayewardenepura
                        </SelectItem>
                        <SelectItem value="University of Kelaniya">
                          University of Kelaniya
                        </SelectItem>
                        <SelectItem value="University of Moratuwa">
                          University of Moratuwa
                        </SelectItem>
                        <SelectItem value="University of Jaffna">
                          University of Jaffna
                        </SelectItem>
                        <SelectItem value="University of Ruhuna">
                          University of Ruhuna
                        </SelectItem>
                        <SelectItem value="Eastern University">
                          Eastern University
                        </SelectItem>
                        <SelectItem value="South Eastern University">
                          South Eastern University
                        </SelectItem>
                        <SelectItem value="Rajarata University">
                          Rajarata University
                        </SelectItem>
                        <SelectItem value="Sabaragamuwa University">
                          Sabaragamuwa University
                        </SelectItem>
                        <SelectItem value="Wayamba University">
                          Wayamba University
                        </SelectItem>
                        <SelectItem value="Uva Wellassa University">
                          Uva Wellassa University
                        </SelectItem>
                        <SelectItem value="University of the Visual & Performing Arts">
                          University of the Visual & Performing Arts
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time (approximate)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe what happened..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionalContact"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I'm willing to provide my contact information for
                        further communication if needed (optional).
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {showOptionalContact && (
                <div className="p-4 border border-neutral-200 rounded-md bg-neutral-100 space-y-4">
                  <p className="text-sm">
                    This information is completely optional and will only be
                    visible to authorized administrators:
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="+94 XX XXX XXXX"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Media Upload Section */}
              <FormField
                name="mediaFiles"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Images (Optional)</FormLabel>
                    <FormDescription>
                      You can upload images related to the incident. Max size:
                      5MB per file.
                    </FormDescription>

                    <div className="mt-2">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          <span>Add Images</span>
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                        />

                        <div className="text-sm text-muted-foreground">
                          Supported formats: JPEG, PNG, WebP
                        </div>
                      </div>

                      {fileUploadError && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{fileUploadError}</AlertDescription>
                        </Alert>
                      )}

                      {selectedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 border rounded-md bg-neutral-50"
                            >
                              <div className="flex items-center gap-2">
                                <FileImage className="h-4 w-4 text-primary" />
                                <span className="text-sm truncate max-w-[200px]">
                                  {file.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => removeFile(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="submit"
                  className="bg-secondary hover:bg-green-600 text-white"
                  disabled={isSubmitting}
                  onClick={async () => {
                    const result = await form.trigger();
                    console.log("FORM DATA = ", form.getValues());

                    if (result) {
                      const formData = form.getValues();
                      onSubmit(formData);
                    } else {
                      const errors = form.formState.errors;
                    }
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset();
                    setSelectedFiles([]);
                    setFileUploadError(null);
                  }}
                  disabled={isSubmitting}
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 p-4 bg-neutral-100 rounded-md text-sm">
            <p className="font-medium mb-1">Important:</p>
            <p>
              Your report will be submitted anonymously, with no IP address or
              identifying information tracked. All reports are encrypted and
              accessible only to authorized personnel.
            </p>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={closeSuccessModal}
        title="Report Submitted Successfully"
        message="Your report has been submitted anonymously. The appropriate authorities will review it promptly."
      />
    </section>
  );
};

export default ReportForm;
