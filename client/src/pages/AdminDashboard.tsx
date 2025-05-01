import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getAuth, signOut } from "firebase/auth";
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  where, 
  onSnapshot, 
  Timestamp 
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import ReportDetailsModal from "@/components/ReportDetailsModal";

interface Report {
  id: string;
  incidentType: string;
  location: string;
  date: string;
  time?: string;
  description: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  contactName?: string;
  contactEmail?: string;
  notes?: Array<{ text: string; timestamp: Timestamp }>;
}

const AdminDashboard = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    resolved: 0
  });
  const [categoryData, setCategoryData] = useState<Array<{name: string; value: number}>>([]);
  const [timeData, setTimeData] = useState<Array<{name: string; reports: number}>>([]);

  const colors = ['#3f51b5', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

  useEffect(() => {
    const db = getFirebaseFirestore();
    
    // Set up real-time listener for reports
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReports: Report[] = [];
      
      querySnapshot.forEach((doc) => {
        fetchedReports.push({
          id: doc.id,
          ...doc.data(),
        } as Report);
      });
      
      setReports(fetchedReports);
      
      // Calculate stats
      const pendingCount = fetchedReports.filter(r => r.status === "pending").length;
      const underReviewCount = fetchedReports.filter(r => r.status === "under-review").length;
      const resolvedCount = fetchedReports.filter(r => r.status === "resolved").length;
      
      setStats({
        total: fetchedReports.length,
        pending: pendingCount,
        underReview: underReviewCount,
        resolved: resolvedCount
      });
      
      // Prepare category data for pie chart
      const typeCounts: {[key: string]: number} = {};
      
      fetchedReports.forEach(report => {
        const type = report.incidentType;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      
      const categoryChartData = Object.entries(typeCounts).map(([name, value]) => ({
        name: formatIncidentType(name),
        value
      }));
      
      setCategoryData(categoryChartData);
      
      // Prepare time data for line chart
      const dateGroups: {[key: string]: number} = {};
      
      // Group by month
      fetchedReports.forEach(report => {
        if (report.createdAt) {
          const date = report.createdAt.toDate();
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
          dateGroups[monthYear] = (dateGroups[monthYear] || 0) + 1;
        }
      });
      
      // Convert to array for chart
      const timeChartData = Object.entries(dateGroups)
        .map(([name, reports]) => ({ name, reports }))
        .sort((a, b) => {
          const [monthA, yearA] = a.name.split('/');
          const [monthB, yearB] = b.name.split('/');
          return new Date(+yearA, +monthA - 1).getTime() - new Date(+yearB, +monthB - 1).getTime();
        });
      
      setTimeData(timeChartData);
    });
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let result = [...reports];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(report => 
        report.location.toLowerCase().includes(query) || 
        report.description.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== "all") {
      result = result.filter(report => report.status === statusFilter);
    }
    
    if (typeFilter !== "all") {
      result = result.filter(report => report.incidentType === typeFilter);
    }
    
    setFilteredReports(result);
  }, [reports, searchQuery, statusFilter, typeFilter]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };
  
  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };
  
  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
  };
  
  const formatIncidentType = (type: string) => {
    switch (type) {
      case 'verbal': return 'Verbal';
      case 'physical': return 'Physical';
      case 'bullying': return 'Bullying';
      case 'rights-violation': return 'Rights Violation';
      case 'other': return 'Other';
      default: return type;
    }
  };
  
  const handleReportUpdate = () => {
    // The onSnapshot will automatically update the UI
    toast({
      title: "Report updated",
      description: "The report has been successfully updated",
    });
  };

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium text-primary">Admin Dashboard</h1>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-neutral-400 hover:text-neutral-600 flex items-center"
            >
              <svg 
                className="w-5 h-5 mr-1" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Total Reports" 
              value={stats.total} 
              color="bg-blue-50" 
              borderColor="border-primary" 
            />
            <StatCard 
              title="Pending" 
              value={stats.pending} 
              color="bg-red-50" 
              borderColor="border-pending" 
            />
            <StatCard 
              title="Under Review" 
              value={stats.underReview} 
              color="bg-orange-50" 
              borderColor="border-under-review" 
            />
            <StatCard 
              title="Resolved" 
              value={stats.resolved} 
              color="bg-green-50" 
              borderColor="border-resolved" 
            />
          </div>
          
          {/* Incident Reports Management */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h2 className="text-xl font-medium mb-2 md:mb-0">Incident Reports</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-8 w-full sm:w-48"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg 
                    className="absolute left-2 top-2.5 h-4 w-4 text-neutral-300" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={typeFilter} 
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="verbal">Verbal</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="bullying">Bullying</SelectItem>
                    <SelectItem value="rights-violation">Rights Violation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Reports Table */}
            <div className="overflow-x-auto border border-neutral-200 rounded-md">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">#{report.id.substring(0, 6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatIncidentType(report.incidentType)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{report.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{report.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={report.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button 
                            variant="link" 
                            className="text-primary hover:text-indigo-700 p-0 h-auto" 
                            onClick={() => handleViewReport(report)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        {reports.length > 0 
                          ? "No reports match your search criteria" 
                          : "No reports have been submitted yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination - simplified for this implementation */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-neutral-300">
                {filteredReports.length > 0 
                  ? `Showing ${Math.min(filteredReports.length, 10)} of ${filteredReports.length} reports` 
                  : "No reports to display"}
              </div>
            </div>
          </div>
          
          {/* Statistics Charts */}
          <div>
            <h2 className="text-xl font-medium mb-4">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-neutral-200 rounded-md p-4">
                <h3 className="font-medium mb-3">Reports by Category</h3>
                <div className="h-64 w-full">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-100">
                      <div className="text-center">
                        <svg 
                          className="h-10 w-10 text-neutral-300 mx-auto mb-2" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-neutral-300">No data available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="border border-neutral-200 rounded-md p-4">
                <h3 className="font-medium mb-3">Reports Over Time</h3>
                <div className="h-64 w-full">
                  {timeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="reports" 
                          stroke="#3f51b5" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-100">
                      <div className="text-center">
                        <svg 
                          className="h-10 w-10 text-neutral-300 mx-auto mb-2" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <p className="text-neutral-300">No data available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          isOpen={showReportModal}
          onClose={closeReportModal}
          report={selectedReport}
          onUpdate={handleReportUpdate}
        />
      )}
    </section>
  );
};

export default AdminDashboard;
