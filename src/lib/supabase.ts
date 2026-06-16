import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[v0] Supabase environment variables not configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          company_name: string | null;
          tax_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          description: string | null;
          unit_price: number;
          category: string | null;
          image_url: string | null;
          tax_applicable: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      quotations: {
        Row: {
          id: string;
          quote_number: string;
          client_id: string;
          rep_name: string | null;
          po_number: string | null;
          quote_date: string;
          valid_until: string | null;
          subtotal: number;
          tax_rate: number;
          tax_amount: number;
          discount: number;
          rent: number;
          grand_total: number;
          advance_percentage: number;
          advance_amount: number;
          balance_due: number;
          status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Invoiced';
          document_type: 'Quotation' | 'Invoice';
          terms: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quotations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['quotations']['Insert']>;
      };
      quotation_items: {
        Row: {
          id: string;
          quotation_id: string;
          product_id: string | null;
          sku: string | null;
          name: string;
          description: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quotation_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['quotation_items']['Insert']>;
      };
      approvals: {
        Row: {
          id: string;
          quotation_id: string;
          approver_role: 'Manager' | 'Director' | 'Finance';
          status: 'Pending' | 'Approved' | 'Rejected';
          comments: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['approvals']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['approvals']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          quotation_id: string;
          invoice_number: string;
          invoice_date: string;
          due_date: string | null;
          status: 'Paid' | 'Unpaid' | 'Overdue' | 'Partially Paid';
          amount_paid: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          payment_date: string;
          amount: number;
          method: 'Bank Transfer' | 'Check' | 'Cash' | 'Card';
          reference_number: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      settings: {
        Row: {
          id: string;
          tax_rate: number;
          default_advance_policy: number;
          company_name: string | null;
          company_address_pk: string | null;
          company_address_uae: string | null;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['settings']['Insert']>;
      };
    };
  };
};
