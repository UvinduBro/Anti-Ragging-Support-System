import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import SuccessModal from "@/components/SuccessModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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
  contactEmail: z.string().email("Invalid email address").optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

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
    },
  });

  const showOptionalContact = form.watch("optionalContact");

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const db = getFirebaseFirestore();
      
      // Only include contact info if the user opted in
      const reportData = {
        ...data,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Remove contact info if not opted in
      if (!data.optionalContact) {
        delete reportData.contactName;
        delete reportData.contactEmail;
      }
      
      await addDoc(collection(db, "reports"), reportData);
      
      setShowSuccess(true);
      form.reset();
    } catch (error) {
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
          <h1 className="text-2xl font-medium text-primary mb-4">Report an Incident</h1>
          <p className="mb-6">Use this form to anonymously report any incident of ragging or human rights violation. Your identity will remain protected.</p>
          
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
                        <SelectItem value="verbal">Verbal Harassment</SelectItem>
                        <SelectItem value="physical">Physical Harassment</SelectItem>
                        <SelectItem value="bullying">Bullying</SelectItem>
                        <SelectItem value="rights-violation">Rights Violation</SelectItem>
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
                        <SelectItem value="University of Colombo">University of Colombo</SelectItem>
                        <SelectItem value="University of Peradeniya">University of Peradeniya</SelectItem>
                        <SelectItem value="University of Sri Jayewardenepura">University of Sri Jayewardenepura</SelectItem>
                        <SelectItem value="University of Kelaniya">University of Kelaniya</SelectItem>
                        <SelectItem value="University of Moratuwa">University of Moratuwa</SelectItem>
                        <SelectItem value="University of Jaffna">University of Jaffna</SelectItem>
                        <SelectItem value="University of Ruhuna">University of Ruhuna</SelectItem>
                        <SelectItem value="Eastern University">Eastern University</SelectItem>
                        <SelectItem value="South Eastern University">South Eastern University</SelectItem>
                        <SelectItem value="Rajarata University">Rajarata University</SelectItem>
                        <SelectItem value="Sabaragamuwa University">Sabaragamuwa University</SelectItem>
                        <SelectItem value="Wayamba University">Wayamba University</SelectItem>
                        <SelectItem value="Uva Wellassa University">Uva Wellassa University</SelectItem>
                        <SelectItem value="University of the Visual & Performing Arts">University of the Visual & Performing Arts</SelectItem>
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
                        I'm willing to provide my contact information for further communication if needed (optional).
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {showOptionalContact && (
                <div className="p-4 border border-neutral-200 rounded-md bg-neutral-100 space-y-4">
                  <p className="text-sm">This information is completely optional and will only be visible to authorized administrators:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <Button 
                  type="submit" 
                  className="bg-secondary hover:bg-green-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-6 p-4 bg-neutral-100 rounded-md text-sm">
            <p className="font-medium mb-1">Important:</p>
            <p>Your report will be submitted anonymously, with no IP address or identifying information tracked. All reports are encrypted and accessible only to authorized personnel.</p>
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
