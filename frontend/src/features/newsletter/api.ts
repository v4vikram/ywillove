import { api } from '@/lib/api/client';

export const subscribe = (email: string, source = 'homepage') =>
  api.post<{ email: string }>('/newsletter/subscribe', { email, source });
