import { useEffect, useRef } from 'react'


// This component receives 3 things from its parent:
// 1. invoiceId → to show in the message "delete invoice #RT3080"
// 2. onConfirm → function to call when user clicks Delete
// 3. onCancel → function to call when user clicks Cancel
interface Props {
  invoiceId: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({ invoiceId, onConfirm, onCancel }: Props) {

  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Auto focus the cancel button when modal first opens
    cancelRef.current?.focus()

    // Listen for ESC key to close the modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Cleanup: remove listener when modal closes
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onCancel]) // runs when onCancel changes (basically once)


  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/50
        flex items-center justify-center
        px-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onCancel}
    >

      <div
        className="
          bg-white dark:bg-[#1E2139]
          rounded-lg p-8 sm:p-12
          w-full max-w-md
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >

        <h2
          id="modal-title"
          className="
            text-2xl font-bold mb-4
            text-[#0C0E16] dark:text-white
          "
        >
          Confirm Deletion
        </h2>

        <p className="
          text-sm text-[#888EB0] dark:text-[#DFE3FA]
          leading-relaxed mb-8
        ">
          Are you sure you want to delete invoice{' '}
          <span className="font-bold">#{invoiceId}</span>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3 justify-end">

          {/* CANCEL BUTTON */}
   
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="
              px-6 py-4 rounded-full
              bg-[#F9FAFE] dark:bg-[#252945]
              text-[#7E88C3] dark:text-[#DFE3FA]
              font-bold text-sm
              hover:bg-[#DFE3FA] dark:hover:bg-[#373B53]
              transition-colors duration-200
            "
          >
            Cancel
          </button>

          {/* DELETE BUTTON */}
          
          <button
            onClick={onConfirm}
            className="
              px-6 py-4 rounded-full
              bg-[#EC5757]
              text-white font-bold text-sm
              hover:bg-[#FF9797]
              transition-colors duration-200
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}