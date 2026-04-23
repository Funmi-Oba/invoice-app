import type { InvoiceStatus } from '../types/invoice'
interface Props {
  status: InvoiceStatus
}

const styles: Record<InvoiceStatus, string> = {
  paid:    'bg-[#33D69F]/10 text-[#33D69F]',
  pending: 'bg-[#FF8F00]/10 text-[#FF8F00]',
  draft:   'bg-[#373B53]/10 text-[#373B53] dark:bg-[#DFE3FA]/10 dark:text-[#DFE3FA]',
}

// Same idea for the little dot colour inside the badge
const dotStyles: Record<InvoiceStatus, string> = {
  paid:    'bg-[#33D69F]',
  pending: 'bg-[#FF8F00]',
  draft:   'bg-[#373B53] dark:bg-[#DFE3FA]',
}


export default function StatusBadge({ status }: Props) {
  return (
    // The outer pill shape
    // styles[status] picks the right colour from our lookup table above
    <span className={`
      inline-flex items-center gap-2
      px-4 py-2 rounded-md
      font-bold text-sm capitalize
      ${styles[status]}
    `}>
      {/* The little circle dot inside the badge */}
      <span className={`
        w-2 h-2 rounded-full
        ${dotStyles[status]}
      `} />

      {/* The status text — "capitalize" in CSS makes first letter uppercase */}
      {/* So "paid" becomes "Paid", "draft" becomes "Draft" etc */}
      {status}
    </span>
  )
}