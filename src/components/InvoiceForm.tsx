import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { useInvoices } from "../context/InvoiceContext";
import type { Invoice, InvoiceItem, InvoiceStatus } from "../types/invoice";

interface Props {
  // If existingInvoice is passed, we are EDITING
  // If it is not passed, we are CREATING

  existingInvoice?: Invoice;
  onClose: () => void;
}

// A blank item template for adding new rows
const EMPTY_ITEM: InvoiceItem = {
  name: "",
  quantity: 1,
  price: 0,
};

// This describes the shape of our form data
interface FormData {
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  paymentDue: string;
  senderAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  clientAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  items: InvoiceItem[];
}

// A blank form for when we are creating a new invoice
const EMPTY_FORM: FormData = {
  description: "",
  paymentTerms: 30,
  clientName: "",
  clientEmail: "",
  paymentDue: "",
  senderAddress: { street: "", city: "", postCode: "", country: "" },
  clientAddress: { street: "", city: "", postCode: "", country: "" },
  items: [{ ...EMPTY_ITEM }],
};

export default function InvoiceForm({ existingInvoice, onClose }: Props) {
  // Are we editing or creating?
  const isEditing = !!existingInvoice;
  // !! converts a value to boolean
  // if existingInvoice exists → true (editing)
  // if it is undefined → false (creating)

  const { addInvoice, updateInvoice } = useInvoices();

  // If editing, pre-fill the form with existing data
  // If creating, start with a blank form
  const [form, setForm] = useState<FormData>(() => {
    if (existingInvoice) {
      return {
        description: existingInvoice.description,
        paymentTerms: existingInvoice.paymentTerms,
        clientName: existingInvoice.clientName,
        clientEmail: existingInvoice.clientEmail,
        paymentDue: existingInvoice.paymentDue,
        senderAddress: { ...existingInvoice.senderAddress },
        clientAddress: { ...existingInvoice.clientAddress },
        items: existingInvoice.items.map((item) => ({ ...item })),
      };
    }
    return { ...EMPTY_FORM };
  });

  // Stores validation error messages
  // e.g. { clientName: 'Client name is required' }
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Updates a top level field like clientName or description

  const setField = (field: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const setAddressField = (
    section: "senderAddress" | "clientAddress",
    field: string,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  // Updates a specific field of a specific item in the items array
  // e.g. setItemField(0, 'name', 'Logo Design')
  const setItemField = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
    const errorKey = `item-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  // Add a new blank item row to the items list
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { ...EMPTY_ITEM }],
    }));
  };

  // Remove an item row by index
  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // VALIDATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required text fields
    if (!form.clientName.trim())
      newErrors.clientName = "Client name is required";

    if (!form.clientEmail.trim()) newErrors.clientEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.clientEmail))
      newErrors.clientEmail = "Must be a valid email address";

    if (!form.description.trim())
      newErrors.description = "Description is required";

    // Sender address
    if (!form.senderAddress.street.trim())
      newErrors["senderAddress.street"] = "Street is required";
    if (!form.senderAddress.city.trim())
      newErrors["senderAddress.city"] = "City is required";
    if (!form.senderAddress.postCode.trim())
      newErrors["senderAddress.postCode"] = "Post code is required";
    if (!form.senderAddress.country.trim())
      newErrors["senderAddress.country"] = "Country is required";

    // Client address
    if (!form.clientAddress.street.trim())
      newErrors["clientAddress.street"] = "Street is required";
    if (!form.clientAddress.city.trim())
      newErrors["clientAddress.city"] = "City is required";
    if (!form.clientAddress.postCode.trim())
      newErrors["clientAddress.postCode"] = "Post code is required";
    if (!form.clientAddress.country.trim())
      newErrors["clientAddress.country"] = "Country is required";

    // Must have at least one item
    if (form.items.length === 0) newErrors.items = "Add at least one item";

    // Validate each item
    form.items.forEach((item, i) => {
      if (!item.name.trim()) newErrors[`item-${i}-name`] = "Required";
      if (item.quantity <= 0)
        newErrors[`item-${i}-quantity`] = "Must be at least 1";
      if (item.price < 0) newErrors[`item-${i}-price`] = "Must be 0 or more";
    });

    setErrors(newErrors);

    // Returns true if no errors (form is valid)
    return Object.keys(newErrors).length === 0;
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SUBMIT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const handleSubmit = (status: InvoiceStatus) => {
    // Stop here if validation fails
    if (!validate()) return;

    if (isEditing) {
      // Update existing invoice
      updateInvoice(existingInvoice!.id, { ...form, status });
    } else {
      // Create new invoice
      addInvoice({ ...form }, status);
    }

    onClose();
  };

  const inputClass = (errorKey: string) => `
    w-full px-4 py-3 rounded-md border text-sm font-medium
    bg-white dark:bg-[#1E2139]
    text-[#0C0E16] dark:text-white
    outline-none transition-colors duration-200
    ${
      errors[errorKey]
        ? "border-[#EC5757] focus:border-[#EC5757]"
        : "border-[#DFE3FA] dark:border-[#252945] focus:border-[#7C5DFA]"
    }
  `;

  const labelClass = (errorKey: string) => `
    block text-xs font-medium mb-2
    ${
      errors[errorKey] ? "text-[#EC5757]" : "text-[#7E88C3] dark:text-[#DFE3FA]"
    }
  `;

  return (
    // Fixed overlay — covers the whole screen
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop — clicking closes the form */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* FORM DRAWER */}
      {/* Slides in from the left */}
      {/* On mobile: full width */}
      {/* On desktop: fixed width of 720px */}
      <div
        className="
  relative z-10
  bg-white dark:bg-[#141625]
  w-full sm:max-w-[620px] lg:max-w-[720px]
  h-full overflow-y-auto
  px-6 sm:px-14
  pt-24 pb-8
  lg:rounded-r-[20px]
  shadow-2xl
  mt-[72px] lg:mt-0 lg:ml-[103px]
"
      >
        {/* Back button — only on mobile */}
        <button
          onClick={onClose}
          className="
            flex items-center gap-4 mb-6
            sm:hidden
            font-bold text-sm
            text-[#0C0E16] dark:text-white
            hover:text-[#7C5DFA]
          "
        >
          <X size={16} className="text-[#7C5DFA]" />
        </button>

        {/* FORM TITLE */}
        <h2
          className="
          text-2xl font-bold mb-10
          text-[#0C0E16] dark:text-white
        "
        >
          {isEditing ? (
            <>
              Edit <span className="text-[#7E88C3]">#</span>
              {existingInvoice!.id}
            </>
          ) : (
            "New Invoice"
          )}
        </h2>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* BILL FROM SECTION */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="mb-10">
          <h3
            className="
            text-[#7C5DFA] font-bold text-sm mb-6
          "
          >
            Bill From
          </h3>

          {/* Street Address */}
          <div className="mb-4">
            <label className={labelClass("senderAddress.street")}>
              Street Address
            </label>
            <input
              className={inputClass("senderAddress.street")}
              value={form.senderAddress.street}
              onChange={(e) =>
                setAddressField("senderAddress", "street", e.target.value)
              }
            />
            {errors["senderAddress.street"] && (
              <p className="text-[#EC5757] text-xs mt-1">
                {errors["senderAddress.street"]}
              </p>
            )}
          </div>

          {/* City, Post Code, Country — 3 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label className={labelClass("senderAddress.city")}>City</label>
              <input
                className={inputClass("senderAddress.city")}
                value={form.senderAddress.city}
                onChange={(e) =>
                  setAddressField("senderAddress", "city", e.target.value)
                }
              />
              {errors["senderAddress.city"] && (
                <p className="text-[#EC5757] text-xs mt-1">
                  {errors["senderAddress.city"]}
                </p>
              )}
            </div>

            {/* Post Code */}
            <div>
              <label className={labelClass("senderAddress.postCode")}>
                Post Code
              </label>
              <input
                className={inputClass("senderAddress.postCode")}
                value={form.senderAddress.postCode}
                onChange={(e) =>
                  setAddressField("senderAddress", "postCode", e.target.value)
                }
              />
              {errors["senderAddress.postCode"] && (
                <p className="text-[#EC5757] text-xs mt-1">
                  {errors["senderAddress.postCode"]}
                </p>
              )}
            </div>

            {/* Country */}
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass("senderAddress.country")}>
                Country
              </label>
              <input
                className={inputClass("senderAddress.country")}
                value={form.senderAddress.country}
                onChange={(e) =>
                  setAddressField("senderAddress", "country", e.target.value)
                }
              />
              {errors["senderAddress.country"] && (
                <p className="text-[#EC5757] text-xs mt-1">
                  {errors["senderAddress.country"]}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* BILL TO SECTION */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="mb-10">
          <h3 className="text-[#7C5DFA] font-bold text-sm mb-6">Bill To</h3>

          {/* Client Name */}
          <div className="mb-4">
            <label className={labelClass("clientName")}>Client Name</label>
            <input
              className={inputClass("clientName")}
              value={form.clientName}
              onChange={(e) => setField("clientName", e.target.value)}
            />
            {errors.clientName && (
              <p className="text-[#EC5757] text-xs mt-1">{errors.clientName}</p>
            )}
          </div>

          {/* Client Email */}
          <div className="mb-4">
            <label className={labelClass("clientEmail")}>Client Email</label>
            <input
              type="email"
              className={inputClass("clientEmail")}
              value={form.clientEmail}
              onChange={(e) => setField("clientEmail", e.target.value)}
            />
            {errors.clientEmail && (
              <p className="text-[#EC5757] text-xs mt-1">
                {errors.clientEmail}
              </p>
            )}
          </div>

          {/* Client Street Address */}
          <div className="mb-4">
            <label className={labelClass("clientAddress.street")}>
              Street Address
            </label>
            <input
              className={inputClass("clientAddress.street")}
              value={form.clientAddress.street}
              onChange={(e) =>
                setAddressField("clientAddress", "street", e.target.value)
              }
            />
            {errors["clientAddress.street"] && (
              <p className="text-[#EC5757] text-xs mt-1">
                {errors["clientAddress.street"]}
              </p>
            )}
          </div>

          {/* Client City, Post Code, Country */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass("clientAddress.city")}>City</label>
              <input
                className={inputClass("clientAddress.city")}
                value={form.clientAddress.city}
                onChange={(e) =>
                  setAddressField("clientAddress", "city", e.target.value)
                }
              />
              {errors["clientAddress.city"] && (
                <p className="text-[#EC5757] text-xs mt-1">
                  {errors["clientAddress.city"]}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass("clientAddress.postCode")}>
                Post Code
              </label>
              <input
                className={inputClass("clientAddress.postCode")}
                value={form.clientAddress.postCode}
                onChange={(e) =>
                  setAddressField("clientAddress", "postCode", e.target.value)
                }
              />
              {errors["clientAddress.postCode"] && (
                <p className="text-[#EC5757] text-xs mt-1">
                  {errors["clientAddress.postCode"]}
                </p>
              )}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass("clientAddress.country")}>
                Country
              </label>
              <input
                className={inputClass("clientAddress.country")}
                value={form.clientAddress.country}
                onChange={(e) =>
                  setAddressField("clientAddress", "country", e.target.value)
                }
              />
              {errors["clientAddress.country"] && (
                <p className="text-[#EC5757] text-xs mt-1">
                  {errors["clientAddress.country"]}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* INVOICE DETAILS SECTION */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="mb-10">
          {/* Payment Date + Terms — 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Invoice Date */}
            <div>
              <label className={labelClass("paymentDue")}>Invoice Date</label>
              <input
                type="date"
                className={inputClass("paymentDue")}
                value={form.paymentDue}
                onChange={(e) => setField("paymentDue", e.target.value)}
              />
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-xs font-medium mb-2 text-[#7E88C3] dark:text-[#DFE3FA]">
                Payment Terms
              </label>
              {/* select is a dropdown */}
              <select
                className={inputClass("")}
                value={form.paymentTerms}
                onChange={(e) =>
                  setField("paymentTerms", Number(e.target.value))
                }
              >
                <option value={1}>Net 1 Day</option>
                <option value={7}>Net 7 Days</option>
                <option value={14}>Net 14 Days</option>
                <option value={30}>Net 30 Days</option>
              </select>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className={labelClass("description")}>
              Project Description
            </label>
            <input
              className={inputClass("description")}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-[#EC5757] text-xs mt-1">
                {errors.description}
              </p>
            )}
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ITEM LIST SECTION */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-[#777F98] mb-6">Item List</h3>

          {/* Error if no items */}
          {errors.items && (
            <p className="text-[#EC5757] text-xs mb-4">{errors.items}</p>
          )}

          {/* Column headers — only show on desktop */}
          <div className="hidden sm:grid grid-cols-[1fr_70px_110px_30px] gap-4 mb-2">
            <span className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] font-medium">
              Item Name
            </span>
            <span className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] font-medium">
              Qty.
            </span>
            <span className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] font-medium">
              Price
            </span>
            <span />
          </div>

          {/* Item rows */}
          <div className="space-y-4">
            {form.items.map((item, i) => (
              <div key={i}>
                {/* Mobile: stacked layout */}
                <div className="sm:hidden space-y-3 mb-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-[#7E88C3]">
                      Item Name
                    </label>
                    <input
                      className={inputClass(`item-${i}-name`)}
                      value={item.name}
                      onChange={(e) => setItemField(i, "name", e.target.value)}
                    />
                    {errors[`item-${i}-name`] && (
                      <p className="text-[#EC5757] text-xs mt-1">
                        {errors[`item-${i}-name`]}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-[70px_1fr_30px] gap-3 items-center">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      className={inputClass(`item-${i}-quantity`)}
                      value={item.quantity}
                      onChange={(e) =>
                        setItemField(i, "quantity", Number(e.target.value))
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      className={inputClass(`item-${i}-price`)}
                      value={item.price}
                      onChange={(e) =>
                        setItemField(i, "price", Number(e.target.value))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="text-[#888EB0] hover:text-[#EC5757] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Desktop: grid layout */}
                <div className="hidden sm:grid grid-cols-[1fr_70px_110px_30px] gap-4 items-start">
                  <div>
                    <input
                      className={inputClass(`item-${i}-name`)}
                      value={item.name}
                      onChange={(e) => setItemField(i, "name", e.target.value)}
                    />
                    {errors[`item-${i}-name`] && (
                      <p className="text-[#EC5757] text-xs mt-1">
                        {errors[`item-${i}-name`]}
                      </p>
                    )}
                  </div>
                  <input
                    type="number"
                    min="1"
                    className={inputClass(`item-${i}-quantity`)}
                    value={item.quantity}
                    onChange={(e) =>
                      setItemField(i, "quantity", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass(`item-${i}-price`)}
                    value={item.price}
                    onChange={(e) =>
                      setItemField(i, "price", Number(e.target.value))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="
                      mt-3 text-[#888EB0]
                      hover:text-[#EC5757]
                      transition-colors
                    "
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD NEW ITEM BUTTON */}
          <button
            type="button"
            onClick={addItem}
            className="
              mt-6 w-full py-4 rounded-full
              bg-[#F9FAFE] dark:bg-[#252945]
              text-[#7E88C3] dark:text-[#DFE3FA]
              font-bold text-sm
              flex items-center justify-center gap-2
              hover:bg-[#DFE3FA] dark:hover:bg-[#373B53]
              transition-colors duration-200
            "
          >
            <Plus size={16} />
            Add New Item
          </button>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* FOOTER BUTTONS */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

        <div className="flex gap-3 justify-end flex-wrap pt-4">
          {/* CREATING a new invoice */}
          {!isEditing && (
            <>
              {/* Discard — closes form without saving */}
              <button
                type="button"
                onClick={onClose}
                className="
          px-6 py-4 rounded-full
          bg-[#F9FAFE] dark:bg-[#252945]
          text-[#7E88C3] font-bold text-sm
          hover:bg-[#DFE3FA] dark:hover:bg-[#373B53]
          transition-colors duration-200
        "
              >
                Discard
              </button>

              {/* Save as Draft */}
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                className="
          px-6 py-4 rounded-full
          bg-[#373B53] dark:bg-[#252945]
          text-[#888EB0] font-bold text-sm
          hover:bg-[#0C0E16]
          transition-colors duration-200
        "
              >
                Save as Draft
              </button>

              {/* Save & Send → status becomes pending */}
              <button
                type="button"
                onClick={() => handleSubmit("pending")}
                className="
          px-6 py-4 rounded-full
          bg-[#7C5DFA] hover:bg-[#9277FF]
          text-white font-bold text-sm
          transition-colors duration-200
        "
              >
                Save & Send
              </button>
            </>
          )}

          {/* EDITING an existing invoice */}
          {isEditing && (
            <>
              {/* Cancel — closes form without saving */}
              <button
                type="button"
                onClick={onClose}
                className="
          px-6 py-4 rounded-full
          bg-[#F9FAFE] dark:bg-[#252945]
          text-[#7E88C3] font-bold text-sm
          hover:bg-[#DFE3FA] dark:hover:bg-[#373B53]
          transition-colors duration-200
        "
              >
                Cancel
              </button>

              {/* If the invoice is a DRAFT show two options */}
              {/* Option 1: keep as draft */}
              {/* Option 2: send it (move to pending) */}
              {existingInvoice!.status === "draft" && (
                <button
                  type="button"
                  onClick={() => handleSubmit("draft")}
                  className="
            px-6 py-4 rounded-full
            bg-[#373B53] dark:bg-[#252945]
            text-[#888EB0] font-bold text-sm
            hover:bg-[#0C0E16]
            transition-colors duration-200
          "
                >
                  Save as Draft
                </button>
              )}

              {/* Save & Send — moves draft to pending */}
              {/* OR saves changes on a pending invoice */}
              {existingInvoice!.status !== "paid" && (
                <button
                  type="button"
                  onClick={() => handleSubmit("pending")}
                  className="
            px-6 py-4 rounded-full
            bg-[#7C5DFA] hover:bg-[#9277FF]
            text-white font-bold text-sm
            transition-colors duration-200
          "
                >
                  {existingInvoice!.status === "draft"
                    ? "Save & Send"
                    : "Save Changes"}
                </button>
              )}

              {/* Paid invoices cannot be edited at all */}
              {/* (the Edit button is already hidden on the detail page) */}
              {/* but just in case, we show a disabled save button */}
              {existingInvoice!.status === "paid" && (
                <button
                  type="button"
                  onClick={() => handleSubmit("paid")}
                  className="
            px-6 py-4 rounded-full
            bg-[#7C5DFA] hover:bg-[#9277FF]
            text-white font-bold text-sm
            transition-colors duration-200
          "
                >
                  Save Changes
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
