import { BASE_URL, TIMEOUTS, ENDPOINTS } from '@/constants';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

interface DecodedAdminToken {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export class AdminApiClient {
  private baseUrl: string;
  private tokenKey: string = 'admin_token';

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = getCookie(this.tokenKey);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        throw new Error('Authentication failed');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API call failed: ${response.statusText}`);
    }

    return response.json();
  }

  setToken(token: string): void {
    setCookie(this.tokenKey, token, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  getToken(): string | null {
    const token = getCookie(this.tokenKey);
    return token ? String(token) : null;
  }

  clearToken(): void {
    deleteCookie(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: DecodedAdminToken = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getAdminInfo(): DecodedAdminToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.DEFAULT);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.DEFAULT);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.DEFAULT);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.DEFAULT);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Admin-specific API methods
  async login(email: string, password: string): Promise<{ access_token: string; admin: any }> {
    const response = await this.post<{ access_token: string; admin: any }>(ENDPOINTS.ADMIN_AUTH.LOGIN, { email, password });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async getProfile(): Promise<any> {
    return this.get(ENDPOINTS.ADMIN_AUTH.PROFILE);
  }

  async getAllJobs(): Promise<any[]> {
    return this.get(ENDPOINTS.ADMIN_JOBS.BASE);
  }

  async getJobById(id: string): Promise<any> {
    return this.get(ENDPOINTS.ADMIN_JOBS.BY_ID(id));
  }

  async updateJobStatus(id: string, status: string): Promise<any> {
    return this.patch(ENDPOINTS.ADMIN_JOBS.UPDATE_STATUS(id), { status });
  }

  async deleteJob(id: string): Promise<any> {
    return this.delete(ENDPOINTS.ADMIN_JOBS.DELETE(id));
  }

  async getAllStudents(): Promise<any[]> {
    return this.get(ENDPOINTS.ADMIN_STUDENTS.BASE);
  }

  async getStudentById(id: string): Promise<any> {
    return this.get(ENDPOINTS.ADMIN_STUDENTS.BY_ID(id));
  }

  logout(): void {
    this.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }
}

// Create and export a singleton instance
export const adminApi = new AdminApiClient(); 