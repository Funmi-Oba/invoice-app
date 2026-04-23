import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useInvoices } from '../context/InvoiceContext'
import InvoiceCard from '../components/InvoiceCard'
import FilterDropdown from '../components/FilterDropdown'
import InvoiceForm from '../components/InvoiceForm'

// we will create InvoiceForm in the next step
// for now just comment it out so no errors show
// import InvoiceForm from '../components/InvoiceForm'

export default function Home() {

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STATE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Controls whether the New Invoice form is open or closed
  // Vue comparison: const showForm = ref(false)
  const [showForm, setShowForm] = useState(false)

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CONTEXT DATA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Get invoices and filtered invoices from our global context
  // Vue comparison: const store = useInvoiceStore()
  const { invoices, filteredInvoices } = useInvoices()

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    // Main container
    // max-w-3xl centers the content and stops it getting too wide
    // mx-auto centers it horizontally
    <div className="
      min-h-screen px-6 py-8
      sm:px-8 sm:py-12
      lg:px-12
      max-w-3xl mx-auto
    ">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* HEADER ROW */}
      {/* Title + Filter + New Invoice button */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex items-center justify-between mb-8 sm:mb-14">

        {/* LEFT: Title + subtitle */}
        <div>
          <h1 className="
            text-2xl sm:text-4xl font-bold
            text-[#0C0E16] dark:text-white
          ">
            Invoices
          </h1>

          {/* Subtitle — shows count of invoices */}
          {/* On mobile: shorter text */}
          {/* On desktop: longer text */}
          <p className="
            text-[#888EB0] dark:text-[#DFE3FA]
            text-sm mt-1
          ">
            {/* Vue comparison: computed property */}
            {invoices.length === 0 ? (
              'No invoices yet'
            ) : (
              <>
                {/* <> is a React Fragment — like <template> in Vue */}
                {/* It lets us return multiple elements without a wrapper div */}
                <span className="hidden sm:inline">
                  There are {filteredInvoices.length} total invoices
                </span>
                <span className="sm:hidden">
                  {filteredInvoices.length} invoices
                </span>
              </>
            )}
          </p>
        </div>

        {/* RIGHT: Filter + New Invoice button */}
        <div className="flex items-center gap-4 sm:gap-8">

          {/* Filter dropdown component from Step 11 */}
          <FilterDropdown />

          {/* NEW INVOICE BUTTON */}
          {/* Clicking this sets showForm to true */}
          {/* Vue comparison: @click="showForm = true" */}
          <button
            onClick={() => setShowForm(true)}
            className="
              flex items-center gap-2 sm:gap-4
              bg-[#7C5DFA] hover:bg-[#9277FF]
              text-white font-bold text-sm
              rounded-full
              pl-2 pr-4 sm:pr-6 py-2
              transition-colors duration-200
            "
          >
            {/* Purple circle with plus icon */}
            <span className="
              bg-white rounded-full
              p-2 flex items-center justify-center
            ">
              <Plus size={14} className="text-[#7C5DFA]" />
            </span>
            {/* Short text on mobile, full text on desktop */}
            <span className="hidden sm:inline">New Invoice</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* INVOICE LIST or EMPTY STATE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* If there are no invoices matching the filter */}
      {/* show the empty state, otherwise show the list */}
      {/* Vue comparison: v-if / v-else */}
      {filteredInvoices.length === 0 ? (

        // EMPTY STATE
        <div className="
          flex flex-col items-center justify-center
          mt-24 text-center
        ">
          {/* Empty illustration */}
          <div className="text-8xl mb-8">📭</div>

          <h2 className="
            text-xl sm:text-2xl font-bold mb-4
            text-[#0C0E16] dark:text-white
          ">
            There is nothing here
          </h2>

          <p className="
            text-[#888EB0] dark:text-[#DFE3FA]
            text-sm max-w-xs leading-relaxed
          ">
            Create an invoice by clicking the{' '}
            <strong>New Invoice</strong>{' '}
            button and get started
          </p>
        </div>

      ) : (

        // INVOICE LIST
        // Loop through filtered invoices and render a card for each
        // Vue comparison: v-for="invoice in filteredInvoices" :key="invoice.id"
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
            />
          ))}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* INVOICE FORM DRAWER */}
      {/* Only renders when showForm is true */}
      {/* Vue comparison: v-if="showForm" */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* We will uncomment this in the next step */}
      {showForm && (
        <InvoiceForm onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}