import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { InvoiceStatus } from '../types/invoice'
import { useInvoices } from '../context/InvoiceContext'


// These are all the options in our dropdown
// 'all' is not an InvoiceStatus so we type it separately
const OPTIONS: Array<InvoiceStatus | 'all'> = ['all', 'draft', 'pending', 'paid']

export default function FilterDropdown() {

  const { filter, setFilter } = useInvoices()

 
  const [open, setOpen] = useState(false)

 
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    // Add the listener when component mounts
    document.addEventListener('mousedown', handleClickOutside)

    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, []) // empty [] means this runs ONCE when component first appears

 
  const handleSelect = (option: InvoiceStatus | 'all') => {
    setFilter(option)   // update the global filter in context
    setOpen(false)      // close the dropdown
  }

  
  return (
    // ref={dropdownRef} attaches our ref to this div
    // so we can detect outside clicks
    <div ref={dropdownRef} className="relative">

      {/* TRIGGER BUTTON */}
      {/* Clicking this opens/closes the dropdown */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center gap-2
          font-bold text-sm
          text-[#0C0E16] dark:text-white
          hover:text-[#7C5DFA] dark:hover:text-[#7C5DFA]
          transition-colors duration-200
        "
      >
       
        <span className="hidden sm:inline">Filter by status</span>
        <span className="sm:hidden">Filter</span>

        {/* Rotate the arrow when dropdown is open */}
        <ChevronDown
          size={16}
          className={`
            text-[#7C5DFA] transition-transform duration-200
            ${open ? 'rotate-180' : 'rotate-0'}
          `}
        />
      </button>

      {/* DROPDOWN MENU */}
      {/* Only shows when open is true */}
      {open && (
        <div className="
          absolute top-full mt-6
          left-1/2 -translate-x-1/2
          w-48 z-50
          bg-white dark:bg-[#252945]
          rounded-lg shadow-2xl
          p-6 space-y-4
        ">
          {/* Loop through all options and show a checkbox for each */}
          {OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center gap-4 cursor-pointer group"
            >
              {/* CHECKBOX */}
              {/* checked means this option is currently selected */}
              <div
                onClick={() => handleSelect(option)}
                className={`
                  w-4 h-4 rounded-sm flex items-center justify-center
                  cursor-pointer transition-colors duration-200
                  ${filter === option
                    ? 'bg-[#7C5DFA]'
                    : 'bg-[#DFE3FA] dark:bg-[#1E2139] group-hover:border-2 group-hover:border-[#7C5DFA]'
                  }
                `}
              >
                {/* Show a tick when this option is selected */}
                {filter === option && (
                  <svg width="10" height="8" viewBox="0 0 10 8" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              {/* OPTION LABEL TEXT */}
              {/* capitalize makes "draft" → "Draft" */}
              <span
                onClick={() => handleSelect(option)}
                className="
                  capitalize font-bold text-sm
                  text-[#0C0E16] dark:text-white
                  group-hover:text-[#7C5DFA]
                  transition-colors duration-200
                "
              >
                {option === 'all' ? 'All' : option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}