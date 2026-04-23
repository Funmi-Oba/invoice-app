# Invoice Management App

A fully functional invoice management application built with React, TypeScript and Tailwind CSS.

## Live Demo
[View Live App](https://funmi-oba.github.io/invoice-app/) 

## GitHub Repository
[View Code](https://github.com/Funmi-Oba/invoice-app) 

---

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Lucide React (icons)
- Vite (build tool)

---

## Setup Instructions

1. Clone the repository:
   git clone https://github.com/Funmi-Oba/invoice-app.git

2. Navigate into the project:
   cd invoice-app

3. Install dependencies:
   npm install

4. Start the development server:
   npm run dev

5. Open your browser at:
   http://localhost:5173

---

## Architecture Explanation

### Folder Structure
- src/components → Reusable UI components (StatusBadge, InvoiceCard, etc.)
- src/context → Global state management (ThemeContext, InvoiceContext)
- src/pages → Full page components (Home, InvoiceDetailPage)
- src/types → TypeScript interfaces and types
- src/utils → Helper functions (formatting, localStorage)

### State Management
Instead of a library like Redux or Pinia, this app uses React's built-in
Context API for global state. Two contexts are used:
- ThemeContext → manages dark/light mode globally
- InvoiceContext → manages all invoice data and actions globally

### Data Persistence
Invoices are saved to localStorage automatically whenever the invoices
array changes, using a useEffect that watches the invoices state.
On first load, the app reads from localStorage. If nothing is saved yet,
sample data is loaded so the app is not empty.

---

## Features Implemented
- Create invoices with full form validation
- Read / view all invoices and individual invoice details
- Update / edit existing invoices
- Delete invoices with confirmation modal
- Save invoices as drafts
- Mark pending invoices as paid
- Filter invoices by status (All, Draft, Pending, Paid)
- Light and dark mode toggle (preference saved to localStorage)
- Fully responsive layout (mobile, tablet, desktop)
- Hover states on all interactive elements
- Keyboard accessible (ESC closes modals, focus management)

---

## Trade-offs

1. Context API vs Redux/Zustand
   Used Context API to keep the project simple and dependency-light.
   For a larger app with more complex state, Zustand would be better.

2. localStorage vs Backend
   localStorage is used for persistence which means data is per-browser.
   A real backend (Node/Express) would allow multi-device access.

3. No animations
   The form drawer has no slide-in animation to keep complexity low.
   CSS transitions could be added with minimal effort.

---

## Accessibility Notes
- Semantic HTML used throughout (aside, main, section, address, button)
- All form fields have associated label elements
- Delete modal traps focus and closes on ESC key press
- Buttons use proper button elements (not divs)
- Color contrast meets WCAG AA standards in both light and dark mode
- aria-label added to icon-only buttons
- aria-modal and role="dialog" on the delete modal

---

## Possible Improvements
- Add animations to the form drawer (slide in/out)
- Add a backend with Node/Express for real persistence
- Add invoice PDF export
- Add pagination for large invoice lists
- Add due date warnings for overdue invoices