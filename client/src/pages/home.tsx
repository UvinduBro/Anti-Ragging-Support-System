import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PieChartComponent, LineChartComponent } from "@/components/statistics/charts";
import { Shield, KeyRound, BookOpen, HandHeart } from "lucide-react";
import { CategoryCount, MonthlyData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { generateChartColors } from "@/lib/utils";

export default function Home() {
  // Sample data for demonstration
  // In a production app, this would come from the API
  const categoryData: CategoryCount[] = [
    { name: "Physical Ragging", value: 28 },
    { name: "Verbal Ragging", value: 35 },
    { name: "Cyberbullying", value: 15 },
    { name: "Discrimination", value: 12 },
    { name: "Sexual Harassment", value: 5 },
    { name: "Other", value: 5 },
  ];

  const resolutionData: MonthlyData[] = [
    { month: "Jan", value: 76 },
    { month: "Feb", value: 78 },
    { month: "Mar", value: 80 },
    { month: "Apr", value: 85 },
    { month: "May", value: 89 },
    { month: "Jun", value: 92 },
    { month: "Jul", value: 90 },
    { month: "Aug", value: 93 },
    { month: "Sep", value: 95 },
  ];

  const testimonialsData = [
    {
      text: "The anonymous reporting system helped me speak up about a ragging incident without fear. The university took immediate action while protecting my identity.",
      author: "Engineering Student",
    },
    {
      text: "The awareness resources helped our student council educate newcomers about their rights. Our campus has seen a 60% reduction in ragging incidents.",
      author: "Student Council President",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-primary rounded-lg shadow-lg overflow-hidden dark:bg-primary dark:bg-opacity-90">
        <div className="px-6 py-12 md:px-12 md:py-16 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Stand Against Ragging & Human Rights Violations
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl">
            A safe platform for university students to report incidents and access
            support. Your identity remains protected.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/report">
              <Button size="lg" className="bg-accent hover:bg-accent-dark text-white font-bold shadow-md">
                Report an Incident
              </Button>
            </Link>
            <Link href="/awareness">
              <Button size="lg" variant="secondary" className="shadow-md">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Anonymous Reporting Card */}
        <Card className="border border-primary rounded-lg overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="mb-4 text-center">
              <div className="inline-block mb-2">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                Anonymous Reporting
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Report incidents without revealing your identity. Your safety and
              privacy are our top priorities.
            </p>
            <Link href="/report" className="mt-auto">
              <Button variant="link" className="text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light p-0">
                File a report <span className="ml-2">→</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Awareness Card */}
        <Card className="border border-secondary rounded-lg overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="mb-4 text-center">
              <div className="inline-block mb-2">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                Awareness Resources
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Learn about anti-ragging laws, what constitutes ragging, and how to
              stay safe on campus.
            </p>
            <Link href="/awareness" className="mt-auto">
              <Button variant="link" className="text-secondary hover:text-secondary-dark dark:text-secondary dark:hover:text-secondary-light p-0">
                Explore resources <span className="ml-2">→</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Support Card */}
        <Card className="border border-accent rounded-lg overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="mb-4 text-center">
              <div className="inline-block mb-2">
                <HandHeart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                Support & Help
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Access helplines, counseling services, and legal assistance for
              victims of ragging or rights violations.
            </p>
            <Link href="/resources" className="mt-auto">
              <Button variant="link" className="text-accent hover:text-accent-dark dark:text-accent dark:hover:text-accent-light p-0">
                Get help <span className="ml-2">→</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Recent Incidents
        </h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">
                Latest Reports
              </h3>
              <Link href="/incidents">
                <Button variant="link" className="text-primary hover:text-primary-dark dark:text-primary dark:hover:text-primary-light text-sm p-0">
                  View all incidents
                </Button>
              </Link>
            </div>
            
            <div className="py-8 text-center">
              <p className="text-neutral-500 mb-4">No incidents reported yet.</p>
              <p className="text-sm text-neutral-400">Recent reports will appear here automatically</p>
              
              {/* Sample incident template - hidden, for reference */}
              {/*
              <div className="flex justify-between border-b border-neutral-200 pb-3 last:border-0">
                <div>
                  <h4 className="font-medium">[Incident Type]</h4>
                  <p className="text-sm text-neutral-500">[Location] • [Date]</p>
                </div>
                <div className="self-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                  Pending
                </div>
              </div>
              */}
            </div>
            
            <div className="mt-4 text-center">
              <Link href="/report">
                <Button className="bg-primary text-white">Report New Incident</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Awareness Banner */}
      <div className="rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Take Action Against Ragging</h2>
            <p className="text-lg mb-6 opacity-90">
              Ragging is a serious crime in Sri Lanka punishable with up to 10 years imprisonment under the Prohibition of Ragging Act, No. 20 of 1998.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">Know Your Rights</h3>
                <p className="text-sm opacity-90">
                  Every student has the right to education free from intimidation, harassment, and violence.
                </p>
                <Link href="/legal">
                  <Button variant="secondary" className="mt-3 w-full">
                    Legal Resources
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">Report Incidents</h3>
                <p className="text-sm opacity-90">
                  Report ragging incidents anonymously. Your identity will remain confidential.
                </p>
                <Link href="/report">
                  <Button variant="secondary" className="mt-3 w-full">
                    File a Report
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2">Get Support</h3>
                <p className="text-sm opacity-90">
                  Access resources, counseling services, and support networks available to victims.
                </p>
                <Link href="/awareness">
                  <Button variant="secondary" className="mt-3 w-full">
                    Awareness Resources
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-semibold">
                Emergency Anti-Ragging Hotline: 011-2695301
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
