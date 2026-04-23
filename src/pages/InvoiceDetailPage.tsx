import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'
import StatusBadge from '../components/StatusBadge'
import DeleteModal from '../components/DeleteModal'
import InvoiceForm from '../components/InvoiceForm'
import { formatCurrency, formatDate, calculateTotal } from '../utils/helpers'
import { ChevronLeft } from 'lucide-react'

export default function InvoiceDetailPage() {

  // useParams reads the :id from the URL
  const { id } = useParams<{ id: string }>()

  // useNavigate lets us go to another page programmatically
  const navigate = useNavigate()

  const { getInvoice, deleteInvoice, markAsPaid } = useInvoices()

  // Get the specific invoice by id from our context
  const invoice = getInvoice(id!)

  // Controls whether delete modal is showing
  const [showDelete, setShowDelete] = useState(false)

  // Controls whether edit form is showing
  const [showEdit, setShowEdit] = useState(false)


  const handleDelete = () => {
    deleteInvoice(id!)      // delete from context + localStorage
    navigate('/')           // go back to home page
  }


  if (!invoice) {
    return (
      <div className="
        flex flex-col items-center justify-center
        min-h-screen gap-4
        text-[#888EB0]
      ">
        <p className="text-lg">Invoice not found.</p>
        <button
          onClick={() => navigate('/')}
          className="
            text-[#7C5DFA] font-bold
            hover:underline
          "
        >
          Go back home
        </button>
      </div>
    )
  }

  // Calculate the grand total of all items
  const total = calculateTotal(invoice.items)

 
  return (
    <div className="
      min-h-screen
      px-6 py-8 sm:px-8 sm:py-12 lg:px-12
      pt-[72px] lg:pt-12
      max-w-3xl mx-auto
      pb-32 sm:pb-12
    ">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* BACK BUTTON */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <button
        onClick={() => navigate('/')}
        className="
          flex items-center gap-3 mb-8
          font-bold text-sm
          text-[#0C0E16] dark:text-white
          hover:text-[#7C5DFA] dark:hover:text-[#7C5DFA]
          transition-colors duration-200
        "
      >
        <ChevronLeft size={16} className="text-[#7C5DFA]" />
        Go back
      </button>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* STATUS BAR */}
      {/* Shows current status + action buttons */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="
        bg-white dark:bg-[#1E2139]
        rounded-lg p-6 sm:px-8
        flex items-center justify-between
        mb-4 shadow-sm
      ">
        {/* Left: Status label + badge */}
        <div className="flex items-center gap-4 flex-1">
          <span className="
            text-sm
            text-[#858BB2] dark:text-[#DFE3FA]
          ">
            Status
          </span>
          <StatusBadge status={invoice.status} />
        </div>

        {/* Right: Action buttons — only visible on desktop */}
        {/* On mobile these buttons move to a fixed bar at the bottom */}
        <div className="hidden sm:flex items-center gap-3">

          {/* Paid invoices cannot be edited */}
          {invoice.status !== 'paid' && (
            <button
              onClick={() => setShowEdit(true)}
              className="
                px-6 py-3 rounded-full
                bg-[#F9FAFE] dark:bg-[#252945]
                text-[#7E88C3] dark:text-[#DFE3FA]
                font-bold text-sm
                hover:bg-[#DFE3FA] dark:hover:bg-[#373B53]
                transition-colors duration-200
              "
            >
              Edit
            </button>
          )}

          {/* Delete button — always visible */}
          <button
            onClick={() => setShowDelete(true)}
            className="
              px-6 py-3 rounded-full
              bg-[#EC5757] hover:bg-[#FF9797]
              text-white font-bold text-sm
              transition-colors duration-200
            "
          >
            Delete
          </button>

          {/* Mark as Paid — only show if status is pending */}
          {/* Draft invoices must be sent first */}
          {/* Paid invoices are already paid */}
          {invoice.status === 'pending' && (
            <button
              onClick={() => markAsPaid(id!)}
              className="
                px-6 py-3 rounded-full
                bg-[#7C5DFA] hover:bg-[#9277FF]
                text-white font-bold text-sm
                transition-colors duration-200
              "
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* INVOICE BODY */}
      {/* The main invoice details card */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="
        bg-white dark:bg-[#1E2139]
        rounded-lg p-6 sm:p-10
        shadow-sm space-y-8
      ">

        {/* TOP ROW: Invoice ID + description / Sender address */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6">

          {/* Left: ID + description */}
          <div>
            <p className="font-bold text-lg text-[#0C0E16] dark:text-white mb-1">
              <span className="text-[#7E88C3]">#</span>
              {invoice.id}
            </p>
            <p className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">
              {invoice.description}
            </p>
          </div>

          {/* Right: Sender address */}
          {/* "not-italic" overrides the browser default italic for address */}
          <address className="
            not-italic text-sm
            text-[#7E88C3] dark:text-[#DFE3FA]
            sm:text-right
            leading-relaxed
          ">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </address>
        </div>

        {/* MIDDLE SECTION: Dates + Client info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">

          {/* Invoice Date */}
          <div>
            <p className="
              text-sm text-[#7E88C3] dark:text-[#DFE3FA] mb-2
            ">
              Invoice Date
            </p>
            <p className="font-bold text-[#0C0E16] dark:text-white">
              {formatDate(invoice.createdAt)}
            </p>
          </div>

          {/* Bill To */}
          <div>
            <p className="
              text-sm text-[#7E88C3] dark:text-[#DFE3FA] mb-2
            ">
              Bill To
            </p>
            <p className="font-bold text-[#0C0E16] dark:text-white mb-1">
              {invoice.clientName}
            </p>
            <address className="
              not-italic text-sm
              text-[#7E88C3] dark:text-[#DFE3FA]
              leading-relaxed
            ">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </address>
          </div>

          {/* Payment Due + Sent To — stacked */}
          <div className="col-span-2 sm:col-span-1 space-y-6">
            <div>
              <p className="
                text-sm text-[#7E88C3] dark:text-[#DFE3FA] mb-2
              ">
                Payment Due
              </p>
              <p className="font-bold text-[#0C0E16] dark:text-white">
                {formatDate(invoice.paymentDue)}
              </p>
            </div>
            <div>
              <p className="
                text-sm text-[#7E88C3] dark:text-[#DFE3FA] mb-2
              ">
                Sent To
              </p>
              <p className="font-bold text-[#0C0E16] dark:text-white">
                {invoice.clientEmail}
              </p>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ITEMS TABLE */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="
          bg-[#F9FAFE] dark:bg-[#252945]
          rounded-lg overflow-hidden
        ">

          {/* Table content */}
          <div className="p-6 sm:p-8">

            {/* Column headers — desktop only */}
            <div className="
              hidden sm:grid
              grid-cols-[1fr_60px_100px_100px]
              gap-4 mb-6
              text-sm text-[#7E88C3] dark:text-[#DFE3FA]
            ">
              <span>Item Name</span>
              <span className="text-center">QTY.</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>

            {/* Item rows */}
           
            <div className="space-y-6">
              {invoice.items.map((item, i) => (
                <div
                  key={i}
                  className="
                    flex justify-between items-center
                    sm:grid sm:grid-cols-[1fr_60px_100px_100px]
                    sm:gap-4
                  "
                >
                  {/* Item name + mobile qty/price */}
                  <div>
                    <p className="
                      font-bold text-sm
                      text-[#0C0E16] dark:text-white
                    ">
                      {item.name}
                    </p>
                    {/* On mobile show qty × price below the name */}
                    <p className="
                      sm:hidden text-sm font-bold
                      text-[#7E88C3] dark:text-[#888EB0] mt-1
                    ">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>

                  {/* Qty — desktop only */}
                  <span className="
                    hidden sm:block text-center
                    text-sm text-[#7E88C3] dark:text-[#DFE3FA]
                  ">
                    {item.quantity}
                  </span>

                  {/* Price — desktop only */}
                  <span className="
                    hidden sm:block text-right
                    text-sm text-[#7E88C3] dark:text-[#DFE3FA]
                  ">
                    {formatCurrency(item.price)}
                  </span>

                  {/* Item total — always visible */}
                  <span className="
                    font-bold text-sm text-right
                    text-[#0C0E16] dark:text-white
                  ">
                    {formatCurrency(item.quantity * item.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GRAND TOTAL BAR */}
          {/* Dark bar at the bottom of the items table */}
          <div className="
            bg-[#373B53] dark:bg-[#0C0E16]
            p-6 sm:px-8
            flex justify-between items-center
            rounded-b-lg
          ">
            <span className="text-sm text-white">Amount Due</span>
            <span className="
              text-2xl font-bold text-white
            ">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MOBILE BOTTOM ACTION BAR */}
      {/* Fixed bar at bottom — only on mobile */}
      {/* On desktop the buttons are in the status bar above */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="
        sm:hidden
        fixed bottom-0 left-0 right-0
        bg-white dark:bg-[#1E2139]
        px-6 py-5
        flex items-center justify-end gap-3
        shadow-lg
      ">
        {invoice.status !== 'paid' && (
          <button
            onClick={() => setShowEdit(true)}
            className="
              px-5 py-3 rounded-full
              bg-[#F9FAFE] dark:bg-[#252945]
              text-[#7E88C3] font-bold text-sm
              hover:bg-[#DFE3FA] transition-colors
            "
          >
            Edit
          </button>
        )}
        <button
          onClick={() => setShowDelete(true)}
          className="
            px-5 py-3 rounded-full
            bg-[#EC5757] hover:bg-[#FF9797]
            text-white font-bold text-sm
            transition-colors
          "
        >
          Delete
        </button>
        {invoice.status === 'pending' && (
          <button
            onClick={() => markAsPaid(id!)}
            className="
              px-5 py-3 rounded-full
              bg-[#7C5DFA] hover:bg-[#9277FF]
              text-white font-bold text-sm
              transition-colors
            "
          >
            Mark as Paid
          </button>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MODALS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* Delete confirmation modal */}
      {/* Only renders when showDelete is true */}

      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {/* Edit form drawer */}
      {/* Only renders when showEdit is true */}
      {showEdit && (
        <InvoiceForm
          existingInvoice={invoice}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}