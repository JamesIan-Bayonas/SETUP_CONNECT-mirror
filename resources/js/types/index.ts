export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  user_type: 'admin' | 'psto_staff' | 'cooperator';
  is_active: boolean;
  photo?: string;
  created_at: string;
  updated_at: string;
}

export interface UserType {
  value: string;
  label: string;
}

export interface BusinessOrganizationTypeRequirement
{
  id: number;
  business_organization_type_id: number;
  description: string;
  require_attachment: boolean;
  is_active: boolean;
}

export interface BusinessOrganizationType 
{
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  requirements: BusinessOrganizationTypeRequirement[]
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url?: string;
    label: string;
    active: boolean;
  }>;
  next_page_url?: string;
  path: string;
  per_page: number;
  prev_page_url?: string;
  to: number;
  total: number;
}

export interface PageProps {
  auth: {
    user: User;
  };
  errors: Record<string, string>;
  success?: string;
  error?: string;
}