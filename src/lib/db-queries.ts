import { supabase, type Database } from './supabase';
import Decimal from 'decimal.js';

type Tables = Database['public']['Tables'];

// ===== CLIENTS =====
export async function getClients() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[v0] Error fetching clients:', error);
    return { data: [], error };
  }
}

export async function createClient(client: Tables['clients']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error creating client:', error);
    return { data: null, error };
  }
}

export async function updateClient(id: string, client: Tables['clients']['Update']) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error updating client:', error);
    return { data: null, error };
  }
}

export async function deleteClient(id: string) {
  try {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('[v0] Error deleting client:', error);
    return { error };
  }
}

// ===== PRODUCTS =====
export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[v0] Error fetching products:', error);
    return { data: [], error };
  }
}

export async function createProduct(product: Tables['products']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error creating product:', error);
    return { data: null, error };
  }
}

export async function updateProduct(id: string, product: Tables['products']['Update']) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error updating product:', error);
    return { data: null, error };
  }
}

// ===== QUOTATIONS =====
export async function getQuotations() {
  try {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        clients (id, name, email, phone, company_name),
        quotation_items (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[v0] Error fetching quotations:', error);
    return { data: [], error };
  }
}

export async function getQuotation(id: string) {
  try {
    const { data, error } = await supabase
      .from('quotations')
      .select(`
        *,
        clients (id, name, email, phone, address, company_name),
        quotation_items (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error fetching quotation:', error);
    return { data: null, error };
  }
}

export async function createQuotation(quotation: Tables['quotations']['Insert'], items: Tables['quotation_items']['Insert'][]) {
  try {
    // Create quotation
    const { data: quotationData, error: quotationError } = await supabase
      .from('quotations')
      .insert([quotation])
      .select()
      .single();
    
    if (quotationError) throw quotationError;

    // Create items with quotation_id
    if (items.length > 0) {
      const itemsWithQuoteId = items.map(item => ({
        ...item,
        quotation_id: quotationData.id
      }));

      const { error: itemsError } = await supabase
        .from('quotation_items')
        .insert(itemsWithQuoteId);
      
      if (itemsError) throw itemsError;
    }

    return { data: quotationData, error: null };
  } catch (error) {
    console.error('[v0] Error creating quotation:', error);
    return { data: null, error };
  }
}

export async function updateQuotation(id: string, quotation: Tables['quotations']['Update']) {
  try {
    const { data, error } = await supabase
      .from('quotations')
      .update(quotation)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error updating quotation:', error);
    return { data: null, error };
  }
}

export async function deleteQuotation(id: string) {
  try {
    const { error } = await supabase.from('quotations').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('[v0] Error deleting quotation:', error);
    return { error };
  }
}

// ===== QUOTATION ITEMS =====
export async function deleteQuotationItem(id: string) {
  try {
    const { error } = await supabase.from('quotation_items').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('[v0] Error deleting quotation item:', error);
    return { error };
  }
}

export async function updateQuotationItem(id: string, item: Tables['quotation_items']['Update']) {
  try {
    const { data, error } = await supabase
      .from('quotation_items')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error updating quotation item:', error);
    return { data: null, error };
  }
}

// ===== APPROVALS =====
export async function getApprovals(quotationId: string) {
  try {
    const { data, error } = await supabase
      .from('approvals')
      .select('*')
      .eq('quotation_id', quotationId);
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[v0] Error fetching approvals:', error);
    return { data: [], error };
  }
}

export async function updateApproval(id: string, approval: Tables['approvals']['Update']) {
  try {
    const { data, error } = await supabase
      .from('approvals')
      .update(approval)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error updating approval:', error);
    return { data: null, error };
  }
}

// ===== INVOICES =====
export async function getInvoices() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        quotations (quote_number)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('[v0] Error fetching invoices:', error);
    return { data: [], error };
  }
}

export async function createInvoice(invoice: Tables['invoices']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error creating invoice:', error);
    return { data: null, error };
  }
}

export async function updateInvoice(id: string, invoice: Tables['invoices']['Update']) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error updating invoice:', error);
    return { data: null, error };
  }
}

// ===== PAYMENTS =====
export async function createPayment(payment: Tables['payments']['Insert']) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error creating payment:', error);
    return { data: null, error };
  }
}

// ===== SETTINGS =====
export async function getSettings() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // No rows found, return defaults
      return { data: null, error: null };
    }
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error fetching settings:', error);
    return { data: null, error };
  }
}

export async function updateSettings(settings: Tables['settings']['Insert']) {
  try {
    // First check if settings exist
    const { data: existing } = await supabase
      .from('settings')
      .select('id')
      .limit(1)
      .single();
    
    let result;
    if (existing) {
      result = await supabase
        .from('settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('settings')
        .insert([settings])
        .select()
        .single();
    }

    const { data, error } = result;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('[v0] Error updating settings:', error);
    return { data: null, error };
  }
}
