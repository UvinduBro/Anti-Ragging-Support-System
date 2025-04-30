import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PieChartComponent,
  BarChartComponent,
  LineChartComponent,
  ComparisonBarChart,
  WeeklyActivityChart,
  StatCard
} from "@/components/statistics/charts";
import { 
  BarChart2, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Calendar, 
  Shield,
  Clock
} from "lucide-react";
import { StatisticsData, CategoryCount, MonthlyData, YearComparisonData, WeeklyActivityData } from "@/lib/types";

export default function Statistics() {
  const [dateRange, setDateRange] = useState("all");
  const [universityFilter, setUniversityFilter] = useState("all");

  // This will be populated from Firebase in production
  // Using empty data structures for a fresh deployment
  const emptyData: CategoryCount[] = [];
  const emptyMonthlyData: MonthlyData[] = [];
  const emptyComparisonData: YearComparisonData[] = [];
  
  const statsData: StatisticsData = {
    incidentsByCategory: emptyData,
    monthlyTrend: emptyMonthlyData,
    incidentsByLocation: emptyData,
    resolutionStatus: emptyData,
    yearComparison: emptyComparisonData,
    weeklyActivity: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      newReports: [0, 0, 0, 0, 0, 0, 0],
      resolvedReports: [0, 0, 0, 0, 0, 0, 0],
    },
    resolutionTime: emptyMonthlyData,
    keyMetrics: {
      totalReports: 0,
      resolutionRate: 0,
      avgResolutionTime: 0,
      awarenessParticipation: 0,
      yearChangePercentage: 0,
      timeChange: 0
    }
  };

  // Filters would be applied in a real application
  const filteredData = statsData;

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
    "Other"
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Statistics Dashboard
        </h1>
        <Link href="/report">
          <Button className="bg-primary text-white">Report New Incident</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <h3 className="text-sm font-medium mb-2">Date Range</h3>
              <Select
                value={dateRange}
                onValueChange={setDateRange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="6month">Last 6 Months</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-sm font-medium mb-2">University</h3>
              <Select
                value={universityFilter}
                onValueChange={setUniversityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map((uni, index) => (
                    <SelectItem key={index} value={uni.toLowerCase().replace(/\s+/g, '-')}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              className="w-full md:w-auto"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value={filteredData.keyMetrics.totalReports}
          icon={<BarChart2 className="h-5 w-5 text-white" />}
        />
        <StatCard
          title="Resolution Rate"
          value={`${filteredData.keyMetrics.resolutionRate}%`}
          change={{
            value: `${Math.abs(filteredData.keyMetrics.yearChangePercentage)}%`,
            positive: filteredData.keyMetrics.yearChangePercentage > 0
          }}
          icon={<Shield className="h-5 w-5 text-white" />}
        />
        <StatCard
          title="Avg. Resolution Time"
          value={`${filteredData.keyMetrics.avgResolutionTime} days`}
          change={{
            value: `${Math.abs(filteredData.keyMetrics.timeChange)} days`,
            positive: filteredData.keyMetrics.timeChange < 0
          }}
          icon={<Clock className="h-5 w-5 text-white" />}
        />
        <StatCard
          title="Awareness Participation"
          value={filteredData.keyMetrics.awarenessParticipation}
          icon={<TrendingUp className="h-5 w-5 text-white" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartComponent
          data={filteredData.incidentsByCategory}
          title="Incidents by Category"
        />
        <PieChartComponent
          data={filteredData.incidentsByLocation}
          title="Incidents by University"
        />
        <LineChartComponent
          data={filteredData.monthlyTrend}
          title="Monthly Incident Trend"
        />
        <PieChartComponent
          data={filteredData.resolutionStatus}
          title="Resolution Status"
        />
        <ComparisonBarChart
          data={filteredData.yearComparison}
          title="Year-over-Year Comparison"
        />
        <LineChartComponent
          data={filteredData.resolutionTime}
          title="Avg. Resolution Time (Days)"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <WeeklyActivityChart
              data={filteredData.weeklyActivity}
              title=""
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center py-6">
        <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-md">
          <p>Statistics will automatically populate as incident reports are submitted and processed.</p>
          <p className="mt-2">For any concerns or inquiries about the statistical information, please contact the administrator.</p>
        </div>
      </div>
    </div>
  );
}