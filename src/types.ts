export interface Product {
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  imageId: string;
  imageUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalSpent: number;
  lastActivity?: string;
}

export interface QuoteItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
  imageUrl?: string;
}

export interface Quote {
  id: string;
  date: string;
  validUntil: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  repName: string;
  items: QuoteItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  rent: number;
  grandTotal: number;
  advancePercentage: number;
  advanceAmount: number;
  balanceDue: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected' | 'Invoiced';
  poNumber?: string;
  pdfLink?: string;
  title?: string;
  tagline?: string;
  footerAddress?: string;
  footerPhone?: string;
  footerEmail?: string;
  logoUrl?: string;
  terms?: string;
  documentType?: 'Quotation' | 'Invoice';
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  note?: string;
}

export interface Invoice extends Omit<Quote, 'status' | 'validUntil'> {
  invoiceId: string;
  quoteId: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Partially Paid';
  amountPaid: number;
  payments: Payment[];
}

export interface QuoteTemplate {
  id: string;
  name: string;
  quote: Partial<Quote>;
}

export interface Settings {
  taxRate: number;
  defaultAdvancePolicy: number;
  companyAddressPK: string;
  companyAddressUAE: string;
}
