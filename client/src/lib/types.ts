import { ReportStatus, ReportType } from "@shared/schema";

// Authentication
export interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string | null;
}

// Reports
export interface ReportData {
  id: string;
  reportId: string;
  type: ReportType;
  location: string;
  description: string;
  incidentDate: string;
  incidentTime: string;
  optionalContact?: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportFormData {
  type: ReportType;
  location: string;
  description: string;
  incidentDate: string;
  incidentTime: string;
  optionalContact?: string;
}

// Action Logs
export interface ActionLogEntry {
  id: number;
  reportId: string;
  adminId: string;
  action: string;
  previousValue: any;
  newValue: any;
  createdAt: Date;
}

// Statistics
export interface StatisticsData {
  incidentsByCategory: CategoryCount[];
  monthlyTrend: MonthlyData[];
  incidentsByLocation: CategoryCount[];
  resolutionStatus: CategoryCount[];
  yearComparison: YearComparisonData[];
  weeklyActivity: WeeklyActivityData;
  resolutionTime: MonthlyData[];
  keyMetrics: KeyMetrics;
}

export interface CategoryCount {
  name: string;
  value: number;
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface YearComparisonData {
  category: string;
  previousYear: number;
  currentYear: number;
}

export interface WeeklyActivityData {
  days: string[];
  newReports: number[];
  resolvedReports: number[];
}

export interface KeyMetrics {
  totalReports: number;
  resolutionRate: number;
  avgResolutionTime: number;
  awarenessParticipation: number;
  yearChangePercentage: number;
  timeChange: number;
}

// Filter Options
export interface FilterOptions {
  searchQuery: string;
  type: string;
  startDate: string;
  endDate: string;
}

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}
