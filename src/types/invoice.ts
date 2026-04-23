// This describes what an address looks like
export interface Address {
  street: string
  city: string
  postCode: string
  country: string
}

// This describes what a single item on an invoice looks like
// e.g. "Logo Design — 2 × £500"
export interface InvoiceItem {
  name: string
  quantity: number
  price: number
}

// The 3 possible statuses an invoice can have
export type InvoiceStatus = 'draft' | 'pending' | 'paid'

// This is the main Invoice — it uses Address and InvoiceItem above
export interface Invoice {
  id: string
  status: InvoiceStatus
  createdAt: string
  paymentDue: string
  description: string
  paymentTerms: number
  clientName: string
  clientEmail: string
  senderAddress: Address
  clientAddress: Address
  items: InvoiceItem[]
}

// This is what the form uses when CREATING an invoice
// (no id or status yet — those get added automatically)
export type InvoiceFormData = Omit<Invoice, 'id' | 'status' | 'createdAt'>