declare module '@/api' {
  interface ApiResponse<T = any> {
    data: T;
    status: number;
  }

  function apiRequest<T = any>(method: string, url: string, data?: any, headers?: any): Promise<ApiResponse<T>>;
  export default apiRequest;
} 