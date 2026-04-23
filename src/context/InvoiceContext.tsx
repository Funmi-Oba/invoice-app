import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { Invoice, InvoiceFormData, InvoiceStatus } from '../types/invoice'
import {
  loadFromStorage,
  saveToStorage,
  generateId,
} from '../utils/helpers'


interface InvoiceContextType {
  invoices: Invoice[]              // the full list of invoices
  filteredInvoices: Invoice[]      // list after filter is applied
  filter: InvoiceStatus | 'all'    // current filter value
  setFilter: (f: InvoiceStatus | 'all') => void  // change the filter
  addInvoice: (data: InvoiceFormData, status: InvoiceStatus) => void
  updateInvoice: (id: string, data: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  markAsPaid: (id: string) => void
  getInvoice: (id: string) => Invoice | undefined
}


const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)



interface InvoiceProviderProps {
  children: React.ReactNode
}

export function InvoiceProvider({ children }: InvoiceProviderProps) {

  // Our list of all invoices
  // useState(() => loadFromStorage()) means:
  // "on first load, get invoices from localStorage"

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    return loadFromStorage()
  })


  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all')


  useEffect(() => {
    saveToStorage(invoices)
  }, [invoices]) //  runs every time invoices array changes


  // ADD a new invoice
  // "prev" is the current invoices array BEFORE we add the new one
  // We spread it [...prev] and add the new invoice at the front
  const addInvoice = (data: InvoiceFormData, status: InvoiceStatus) => {
    const newInvoice: Invoice = {
      ...data,               // spread all form fields
      id: generateId(),      // generate a random ID like "RT3080"
      status,                // 'draft' or 'pending'
      createdAt: new Date().toISOString().split('T')[0], // today's date
    }
    setInvoices((prev) => [newInvoice, ...prev])
  }

  
  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, ...data } // found it — merge the new data in
          : inv                 // not this one — return unchanged
      )
    )
  }

  
  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }

  // MARK AS PAID
  // Uses updateInvoice we already wrote above — just updates status
  const markAsPaid = (id: string) => {
    updateInvoice(id, { status: 'paid' })
  }

  // GET a single invoice by id
 
  const getInvoice = (id: string): Invoice | undefined => {
    return invoices.find((inv) => inv.id === id)
  }


  const filteredInvoices =
    filter === 'all'
      ? invoices
      : invoices.filter((inv) => inv.status === filter)

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        filteredInvoices,
        filter,
        setFilter,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        getInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}


export function useInvoices(): InvoiceContextType {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoices must be used inside InvoiceProvider')
  }
  return context
}