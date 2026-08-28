import { 
  BusinessData, 
  AnalyticsOverview, 
  TopQuestion, 
  UnansweredQuery, 
  ChatLog,
  Order,
  OrderStatus,
  InteractiveOrderPayload
} from '../types';

const API_BASE = '/api';

export function getStoredToken(): string | null {
  return localStorage.getItem('convo_token');
}

export function setStoredToken(token: string) {
  localStorage.setItem('convo_token', token);
}

export function removeStoredToken() {
  localStorage.removeItem('convo_token');
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// --- PUBLIC APIS ---
export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchExchangeRatesApi(): Promise<{ base: string; rates: Record<string, number>; lastUpdated: string }> {
  try {
    const res = await fetch(`${API_BASE}/exchange-rates`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch live exchange rates, falling back to local constants:', err);
  }
  return {
    base: 'USD',
    rates: {
      USD: 1.0,
      INR: 86.50,
      EUR: 0.92,
      GBP: 0.79,
      CAD: 1.38,
      AUD: 1.55,
      AED: 3.67,
      SGD: 1.35,
      JPY: 152.0
    },
    lastUpdated: new Date().toISOString()
  };
}

export async function fetchPublicBusinessBySlug(slug: string): Promise<BusinessData> {
  const res = await fetch(`${API_BASE}/businesses/slug/${slug}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch business data');
  }
  return res.json();
}

// --- PUBLIC ORDER / BOOKING SUBMISSION ---
export async function submitOrderApi(businessId: string, orderData: any): Promise<Order> {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to submit order');
  }
  return res.json();
}

// --- AUTH APIS ---
export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  if (data.token) setStoredToken(data.token);
  return data;
}

export async function apiRegister(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  if (data.token) setStoredToken(data.token);
  return data;
}

export async function sendPasswordResetOtpApi(email: string) {
  const res = await fetch(`${API_BASE}/auth/forgot-password/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to dispatch OTP verification code');
  return data;
}

export async function verifyOtpAndResetPasswordApi(email: string, otp: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/auth/forgot-password/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Invalid or expired OTP code');
  if (data.token) setStoredToken(data.token);
  return data;
}

export async function apiForgotPassword(email: string) {
  return sendPasswordResetOtpApi(email);
}

export async function apiResetPassword(email: string, newPassword: string, otp?: string) {
  if (otp) return verifyOtpAndResetPasswordApi(email, otp, newPassword);
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to reset password');
  if (data.token) setStoredToken(data.token);
  return data;
}

export async function apiGetMe() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

// Aliases
export const loginApi = apiLogin;
export const registerApi = apiRegister;
export const forgotPasswordApi = sendPasswordResetOtpApi;
export const resetPasswordApi = apiResetPassword;
export const getMeApi = apiGetMe;

// --- OWNER BUSINESS APIS ---
export async function fetchMyBusinesses(): Promise<BusinessData[]> {
  const res = await fetch(`${API_BASE}/businesses/my`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to load businesses');
  return res.json();
}

export async function createBusiness(data: any): Promise<BusinessData> {
  const res = await fetch(`${API_BASE}/businesses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create business');
  }
  return res.json();
}
export const createBusinessApi = createBusiness;

export async function updateBusinessProfile(id: string, data: any) {
  const res = await fetch(`${API_BASE}/businesses/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update business');
  }
  return res.json();
}
export const updateBusinessProfileApi = updateBusinessProfile;

export async function deleteBusiness(id: string) {
  const res = await fetch(`${API_BASE}/businesses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete business');
  return res.json();
}

export async function updateBusinessHours(id: string, hours: any[]) {
  const res = await fetch(`${API_BASE}/businesses/${id}/hours`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ hours })
  });
  if (!res.ok) throw new Error('Failed to update hours');
  return res.json();
}
export const updateBusinessHoursApi = updateBusinessHours;

export async function createMenuItem(businessId: string, itemData: any) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/menu`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(itemData)
  });
  if (!res.ok) throw new Error('Failed to create menu item');
  return res.json();
}
export const createMenuItemApi = createMenuItem;

export async function updateMenuItem(businessId: string, itemId: string, itemData: any) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/menu/${itemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(itemData)
  });
  if (!res.ok) throw new Error('Failed to update menu item');
  return res.json();
}
export const updateMenuItemApi = updateMenuItem;

export async function deleteMenuItem(businessId: string, itemId: string) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/menu/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete menu item');
  return res.json();
}
export const deleteMenuItemApi = deleteMenuItem;

export async function createFaq(businessId: string, faqData: any) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/faqs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(faqData)
  });
  if (!res.ok) throw new Error('Failed to create FAQ');
  return res.json();
}
export const createFaqApi = createFaq;

export async function updateFaq(businessId: string, faqId: string, faqData: any) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/faqs/${faqId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(faqData)
  });
  if (!res.ok) throw new Error('Failed to update FAQ');
  return res.json();
}
export const updateFaqApi = updateFaq;

export async function deleteFaq(businessId: string, faqId: string) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/faqs/${faqId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete FAQ');
  return res.json();
}
export const deleteFaqApi = deleteFaq;

export async function updateBotConfig(businessId: string, botData: any) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/bot`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(botData)
  });
  if (!res.ok) throw new Error('Failed to update bot config');
  return res.json();
}
export const updateBotConfigApi = updateBotConfig;

// --- PHASE 4 OWNER ORDERS APIS ---
export async function fetchOrdersApi(businessId: string, statusFilter = 'all'): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/orders?status=${statusFilter}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function updateOrderStatusApi(businessId: string, orderId: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return res.json();
}

export async function deleteOrderApi(businessId: string, orderId: string) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/orders/${orderId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete order');
  return res.json();
}

// --- PHASE 3 ANALYTICS APIS ---
export async function fetchAnalyticsOverview(businessId: string, days = 30): Promise<AnalyticsOverview> {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/analytics/overview?days=${days}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch analytics overview');
  return res.json();
}

export async function fetchTopQuestions(businessId: string, limit = 10): Promise<TopQuestion[]> {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/analytics/top-questions?limit=${limit}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch top questions');
  return res.json();
}

export async function fetchUnansweredQuestions(businessId: string): Promise<UnansweredQuery[]> {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/analytics/unanswered`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch unanswered questions');
  return res.json();
}

export async function fetchChatLogs(businessId: string, search = '', limit = 100): Promise<ChatLog[]> {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/analytics/logs?search=${encodeURIComponent(search)}&limit=${limit}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch chat logs');
  return res.json();
}

export async function downloadChatLogsCsv(businessId: string, businessSlug: string) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/analytics/export-csv`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to export CSV');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${businessSlug}-chat-logs-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// --- STREAMING CHAT CLIENT ---
export async function sendChatMessageStream({
  messages,
  businessData,
  businessSlug,
  apiKey,
  onChunk,
  onInteractiveAction,
  onDone,
  onError
}: {
  messages: any[];
  businessData?: BusinessData;
  businessSlug?: string;
  apiKey?: string;
  onChunk: (chunk: string) => void;
  onInteractiveAction?: (action: InteractiveOrderPayload) => void;
  onDone: () => void;
  onError: (err: Error) => void;
}) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        businessData,
        businessSlug,
        apiKey
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    if (!res.body) throw new Error('No readable stream in response');

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const jsonStr = trimmed.substring(6);

        try {
          const data = JSON.parse(jsonStr);
          if (data.chunk) {
            onChunk(data.chunk);
          }
          if (data.interactiveAction && onInteractiveAction) {
            onInteractiveAction(data.interactiveAction);
          }
          if (data.done) {
            onDone();
            return;
          }
          if (data.error) {
            throw new Error(data.error);
          }
        } catch (e: any) {
          if (e.message !== 'Unexpected end of JSON input') {
            console.warn('SSE Parse error:', e);
          }
        }
      }
    }
    onDone();
  } catch (err: any) {
    console.error('Chat streaming failed:', err);
    onError(err);
  }
}

// --- CUSTOMER REVIEWS & RATINGS API ---
export async function submitReviewApi(businessId: string, reviewData: { customerName?: string; rating: number; comment: string; source?: 'chat' | 'storefront'; tags?: string[] }) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit review');
  }
  return res.json();
}

export async function fetchReviewsApi(businessId: string) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}
