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

export interface DocumentType {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  requirements_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessOrganizationTypeRequirement
{
  id: number;
  business_organization_type_id: number;
  document_type_id: number;
  document_type?: DocumentType;
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

export interface CustomerDocumentAuditLog {
  action: 'uploaded' | 're_uploaded' | 'verified' | 'rejected';
  status_before: string | null;
  status_after: string;
  original_filename: string | null;
  remarks: string | null;
  performed_by_name: string | null;
  created_at: string;
}

export interface CustomerDocumentSlot {
  id: number;
  requirement_id: number;
  document_type_name: string;
  require_attachment: boolean;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  file_path: string | null;
  original_filename: string | null;
  remarks: string | null;
  uploaded_by_name: string | null;
  verified_by_name: string | null;
  verified_at: string | null;
  audit_logs: CustomerDocumentAuditLog[];
}

export interface TnaSchedule {
  id: number;
  scheduled_date: string;
  location: string;
  conducted_by_name: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string | null;
}

export interface ManifestationOfIntent {
  id: number;
  status: 'pending_upload' | 'uploaded' | 'acknowledged';
  interventions: string[];
  other_intervention: string | null;
  training_specify: string | null;
  proponent_name: string | null;
  proponent_date: string | null;
  proponent_address: string | null;
  proponent_contact: string | null;
  signed_file_path: string | null;
  original_filename: string | null;
  uploaded_at: string | null;
  acknowledged_by_name: string | null;
  acknowledged_at: string | null;
  tna_schedule: TnaSchedule | null;
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