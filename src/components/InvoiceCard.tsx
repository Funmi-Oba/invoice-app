import { useNavigate } from 'react-router-dom'
import type { Invoice } from '../types/invoice'
import StatusBadge from './StatusBadge'
import { formatCurrency, formatDate, calculateTotal } from '../utils/helpers'
import { ChevronRight } from 'lucide-react'


interface Props {
  invoice: Invoice
}

export default function InvoiceCard({ invoice }: Props) {
  const navigate = useNavigate()

  // Calculate the total amount for this invoice
  // e.g. [{quantity: 2, price: 500}] → £1,000.00
  const total = calculateTotal(invoice.items)

  return (
    // The whole card is clickable
    // Clicking navigates to the invoice detail page
    <div
      onClick={() => navigate(`/invoice/${invoice.id}`)}
      className="
        bg-white dark:bg-[#1E2139]
        rounded-lg p-6 sm:px-8
        cursor-pointer
        border border-transparent
        hover:border-[#7C5DFA]
        transition-all duration-200
        shadow-sm
      "
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MOBILE LAYOUT */}
      {/* Only visible on small screens (hidden on sm and above) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="sm:hidden space-y-4">

        {/* Row 1: ID + Client Name */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#0C0E16] dark:text-white">
            {/* The # is grey, the ID is white/dark */}
            <span className="text-[#7E88C3]">#</span>
            {invoice.id}
          </span>
          <span className="text-[#858BB2] dark:text-[#DFE3FA] text-sm">
            {invoice.clientName}
          </span>
        </div>

        {/* Row 2: Due Date + Amount + Status */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            {/* Due date */}
            <p className="text-[#7E88C3] dark:text-[#DFE3FA] text-sm">
              Due {formatDate(invoice.paymentDue)}
            </p>
            {/* Amount */}
            <p className="font-bold text-lg text-[#0C0E16] dark:text-white">
              {formatCurrency(total)}
            </p>
          </div>
          {/* Status badge — our reusable component from Step 10 */}
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* DESKTOP LAYOUT */}
      {/* Only visible on sm screens and above */}
      {/* All info in one single row */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="
        hidden sm:grid
        grid-cols-[100px_1fr_1fr_120px_140px_20px]
        items-center gap-4
      ">
        {/* Invoice ID */}
        <span className="font-bold text-[#0C0E16] dark:text-white">
          <span className="text-[#7E88C3]">#</span>
          {invoice.id}
        </span>

        {/* Due Date */}
        <span className="text-[#7E88C3] dark:text-[#DFE3FA] text-sm">
          Due {formatDate(invoice.paymentDue)}
        </span>

        {/* Client Name */}
        <span className="text-[#858BB2] dark:text-[#DFE3FA] text-sm">
          {invoice.clientName}
        </span>

        {/* Total Amount */}
        <span className="font-bold text-lg text-[#0C0E16] dark:text-white">
          {formatCurrency(total)}
        </span>

        {/* Status Badge */}
        <StatusBadge status={invoice.status} />

        {/* Arrow icon — just a visual hint that it's clickable */}
        <ChevronRight size={16} className="text-[#7C5DFA]" />
      </div>
    </div>
  )
}