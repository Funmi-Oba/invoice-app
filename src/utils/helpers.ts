import type { Invoice, InvoiceItem } from '../types/invoice'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOCAL STORAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STORAGE_KEY = 'invoice-app-data'

// This SAVES your invoices to the browser's memory
export function saveToStorage(invoices: Invoice[]): void {
  // JSON.stringify turns your array into a string so it can be stored
  // e.g. [{id: 'RT3080', ...}]  becomes  '[{"id":"RT3080",...}]'
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}

// This LOADS your invoices from the browser's memory
export function loadFromStorage(): Invoice[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    // If nothing is saved yet, return the sample invoices below
    // so the app isn't empty on first load
    return data ? JSON.parse(data) : sampleInvoices
  } catch {
    return sampleInvoices
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GENERATE RANDOM ID
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Creates a random ID like "RT3080" or "XM9141"
// 2 random letters + 4 random numbers
export function generateId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetter = () => letters[Math.floor(Math.random() * 26)]
  const randomNum = Math.floor(Math.random() * 9000) + 1000
  return `${randomLetter()}${randomLetter()}${randomNum}`
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FORMAT CURRENCY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Turns a number like 1800.9 into "£1,800.90"
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FORMAT DATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Turns "2021-08-18" into "18 Aug 2021"
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CALCULATE TOTAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Adds up all items on an invoice
// e.g. [{quantity: 2, price: 500}, {quantity: 1, price: 200}]
//      = (2 × 500) + (1 × 200) = £1,200
export function calculateTotal(items: InvoiceItem[]): number {
  return items.reduce((total, item) => {
    return total + item.quantity * item.price
  }, 0)
  // reduce is like a loop that keeps a running total
  // it starts at 0 and adds each item's subtotal one by one
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SAMPLE DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// This is fake data so the app looks full on first load
// instead of being completely empty
const sampleInvoices: Invoice[] = [
  {
    id: 'RT3080',
    status: 'paid',
    createdAt: '2021-08-18',
    paymentDue: '2021-08-19',
    description: 'Re-branding',
    paymentTerms: 1,
    clientName: 'Jensen Huang',
    clientEmail: 'jensenh@mail.com',
    senderAddress: {
      street: '19 Union Terrace',
      city: 'London',
      postCode: 'E1 3EZ',
      country: 'United Kingdom',
    },
    clientAddress: {
      street: '106 Kendell Street',
      city: 'Sharrington',
      postCode: 'NR24 5WQ',
      country: 'United Kingdom',
    },
    items: [{ name: 'Brand Guidelines', quantity: 1, price: 1800.90 }],
  },
  {
    id: 'XM9141',
    status: 'pending',
    createdAt: '2021-08-21',
    paymentDue: '2021-09-20',
    description: 'Graphic Design',
    paymentTerms: 30,
    clientName: 'Alex Grim',
    clientEmail: 'alexgrim@mail.com',
    senderAddress: {
      street: '19 Union Terrace',
      city: 'London',
      postCode: 'E1 3EZ',
      country: 'United Kingdom',
    },
    clientAddress: {
      street: '84 Church Way',
      city: 'Bradford',
      postCode: 'BD1 9PB',
      country: 'United Kingdom',
    },
    items: [
      { name: 'Banner Design', quantity: 1, price: 156.00 },
      { name: 'Email Design', quantity: 2, price: 200.00 },
    ],
  },
  {
    id: 'RG0314',
    status: 'draft',
    createdAt: '2021-09-01',
    paymentDue: '2021-09-31',
    description: 'Website Redesign',
    paymentTerms: 7,
    clientName: 'John Morrison',
    clientEmail: 'john@mail.com',
    senderAddress: {
      street: '19 Union Terrace',
      city: 'London',
      postCode: 'E1 3EZ',
      country: 'United Kingdom',
    },
    clientAddress: {
      street: '3 Cat Lane',
      city: 'Portadown',
      postCode: 'BT63 5YX',
      country: 'United Kingdom',
    },
    items: [{ name: 'Website Redesign', quantity: 1, price: 14002.33 }],
  },
]