import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, PackageCheck } from "lucide-react";
import { offers, products } from "../data/products";
import { hasSupabaseConfig, publicSupabase } from "../lib/supabaseClient";

const SIZES = ["S", "M", "L", "XL", "XXL"];

function createInitialForm(selectedOffer) {
  return {
  firstName: "",
  lastName: "",
  phone: "",
  city: "",
  address: "",
    offer: selectedOffer?.label || offers[1].label,
  size: "",
  quantity: 1,
  notes: "",
  };
}

function validateOrder(form) {
  const errors = {};

  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.address.trim()) errors.address = "Home address is required.";
  if (!form.offer) errors.offer = "Please choose an offer.";
  if (!form.size) errors.size = "Please choose a size.";
  if (Number(form.quantity) < 1) errors.quantity = "Quantity must be at least 1.";

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-2 text-xs font-bold text-red-700">{message}</p>;
}

export default function OrderForm({ selectedProduct = products[0], selectedOffer = offers[1] }) {
  const [form, setForm] = useState(() => createInitialForm(selectedOffer));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const totalLabel = useMemo(() => {
    const selected = offers.find((offer) => offer.label === form.offer) || selectedOffer;
    const unitPrice = selected.price;
    return `${unitPrice * Number(form.quantity || 1)} DH`;
  }, [form.offer, form.quantity, selectedOffer]);

  const estimatedTotal = useMemo(() => {
    const selected = offers.find((offer) => offer.label === form.offer) || selectedOffer;
    return selected.price * Number(form.quantity || 1);
  }, [form.offer, form.quantity, selectedOffer]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateOrder(form);
    setErrors(nextErrors);
    setSubmitStatus(null);

    if (Object.keys(nextErrors).length > 0) return;

    if (!hasSupabaseConfig || !publicSupabase) {
      setSubmitStatus({
        type: "error",
        message: "Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      product_name: selectedProduct.name,
      product_color: selectedProduct.color,
      product_slug: selectedProduct.slug,
      offer: form.offer,
      size: form.size,
      quantity: Number(form.quantity),
      estimated_total: estimatedTotal,
      notes: form.notes.trim() || null,
      payment_method: "Cash on Delivery",
      status: "new",
    };

    const { error } = await publicSupabase.from("orders").insert(payload);

    setIsSubmitting(false);

    if (error) {
      setSubmitStatus({
        type: "error",
        message: "Order could not be sent. Please try again or contact us by DM.",
      });
      return;
    }

    fetch("/.netlify/functions/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, created_at: new Date().toISOString() }),
    }).catch((emailError) => {
      console.warn("Order email notification failed", emailError);
    });

    setForm(createInitialForm(selectedOffer));
    setErrors({});
    setSubmitStatus({
      type: "success",
      message: "Your order has been received. We will contact you soon to confirm delivery. Payment is Cash on Delivery.",
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-soft sm:p-7 lg:p-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      noValidate
    >
      <div className="mb-7 rounded-3xl border border-gold/30 bg-chalk p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-dune">
            <PackageCheck size={18} />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-gold">Cash on Delivery</p>
            <p className="mt-2 text-sm font-bold leading-6 text-ink">
              Payment is Cash on Delivery. You pay only when you receive your order.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="form-field">
          <span>First name</span>
          <input value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} autoComplete="given-name" />
          <FieldError message={errors.firstName} />
        </label>

        <label className="form-field">
          <span>Last name</span>
          <input value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} autoComplete="family-name" />
          <FieldError message={errors.lastName} />
        </label>

        <label className="form-field">
          <span>Phone number</span>
          <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} inputMode="tel" autoComplete="tel" />
          <FieldError message={errors.phone} />
        </label>

        <label className="form-field">
          <span>City</span>
          <input value={form.city} onChange={(event) => updateField("city", event.target.value)} autoComplete="address-level2" />
          <FieldError message={errors.city} />
        </label>

        <label className="form-field sm:col-span-2">
          <span>Home address</span>
          <input value={form.address} onChange={(event) => updateField("address", event.target.value)} autoComplete="street-address" />
          <FieldError message={errors.address} />
        </label>

        <label className="form-field">
          <span>Selected offer</span>
          <select value={form.offer} onChange={(event) => updateField("offer", event.target.value)}>
            {offers.map((offer) => (
              <option key={offer.slug} value={offer.label}>
                {offer.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.offer} />
        </label>

        <label className="form-field">
          <span>Size</span>
          <select value={form.size} onChange={(event) => updateField("size", event.target.value)}>
            <option value="">Choose size</option>
            {SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <FieldError message={errors.size} />
        </label>

        <label className="form-field">
          <span>Quantity</span>
          <input
            value={form.quantity}
            onChange={(event) => updateField("quantity", event.target.value)}
            min="1"
            inputMode="numeric"
            type="number"
          />
          <FieldError message={errors.quantity} />
        </label>

        <div className="rounded-3xl border border-ink/10 bg-paper p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-smoke">Estimated total</p>
          <p className="mt-2 text-3xl font-black text-ink">{totalLabel}</p>
          <p className="mt-2 text-xs font-bold text-smoke">COD only. Delivery confirmation by phone.</p>
        </div>

        <label className="form-field sm:col-span-2">
          <span>Notes / optional message</span>
          <textarea
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            rows="4"
            placeholder="Size note, delivery time, or anything we should know."
          />
        </label>
      </div>

      {submitStatus && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-3xl border p-4 text-sm font-bold leading-6 ${
            submitStatus.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
          role="status"
        >
          {submitStatus.type === "success" ? <CheckCircle2 className="mt-0.5 shrink-0" size={18} /> : <AlertCircle className="mt-0.5 shrink-0" size={18} />}
          <p>{submitStatus.message}</p>
        </div>
      )}

      <button type="submit" className="btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={18} /> Sending order
          </>
        ) : (
          "Submit COD Order"
        )}
      </button>
    </motion.form>
  );
}
