"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, MapPin, User, Phone, Car } from "lucide-react";
import { cars } from "@/lib/cars";

const WHATSAPP_NUMBER = "971527074847";

type RentalPlan = "Daily" | "Weekly" | "Monthly";

function buildWhatsAppUrl(
  carName: string,
  fromDate: string,
  fromTime: string,
  toDate: string,
  toTime: string,
  address: string,
  fullName: string,
  phone: string
): string {
  const message = [
    "Booking Request: " + carName + " | From: " + fromDate + " " + fromTime + " | To: " + toDate + " " + toTime + " | Address: " + address,
    "",
    "Customer: " + fullName,
    "Phone: " + phone,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const period = h < 12 ? "AM" : "PM";
    const hour = h % 12 || 12;
    const min = m.toString().padStart(2, "0");
    TIME_OPTIONS.push(`${hour}:${min} ${period}`);
  }
}

interface BookNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCar?: string;
  initialPlan?: RentalPlan;
}

const inputClass =
  "w-full rounded-xl border border-white/20 bg-matte-black/50 px-4 py-3 text-white placeholder-white/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition min-h-[48px] sm:min-h-[44px]";

export default function BookNowModal({ isOpen, onClose, initialCar = "", initialPlan = "Daily" }: BookNowModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCar, setSelectedCar] = useState(initialCar);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [address, setAddress] = useState("");
  const [plan, setPlan] = useState<RentalPlan>(initialPlan);

  useEffect(() => {
    if (isOpen && initialCar) setSelectedCar(initialCar);
    if (isOpen && initialPlan) setPlan(initialPlan);
  }, [isOpen, initialCar, initialPlan]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const carName = selectedCar || "a vehicle";
    const fromTime = pickupTime || "—";
    const toTime = dropoffTime || "—";
    const url = buildWhatsAppUrl(carName, fromDate, fromTime, toDate, toTime, address || "—", fullName, phone);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "autobreeze_booking",
          JSON.stringify({ fullName, phone, selectedCar: carName, fromDate, toDate, pickupTime, dropoffTime, address, plan })
        );
      } catch (_) {}
      window.open(url, "_blank", "noopener,noreferrer");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="book-now-title"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-charcoal/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl pointer-events-auto max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 id="book-now-title" className="font-display text-2xl font-bold text-white">
                  Book Now
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-white/60 mb-6">
                Fill in your details and we&apos;ll confirm your booking via WhatsApp.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="block text-sm font-medium text-white/80 mb-2">Rental period</span>
                  <div className="flex rounded-xl border border-white/20 bg-matte-black/50 p-1">
                    {(["Daily", "Weekly", "Monthly"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlan(p)}
                        className={`flex-1 rounded-lg py-3 text-sm font-medium transition-all duration-300 ${
                          plan === p ? "bg-gold text-matte-black shadow-glow" : "text-white/80 hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-from" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-1.5">
                      <CalendarDays className="h-4 w-4 text-gold/80" aria-hidden />
                      From
                    </label>
                    <input
                      id="modal-from"
                      type="date"
                      required
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-to" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-1.5">
                      <CalendarDays className="h-4 w-4 text-gold/80" aria-hidden />
                      To
                    </label>
                    <input
                      id="modal-to"
                      type="date"
                      required
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-pickup-time" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-1.5">
                      <Clock className="h-4 w-4 text-gold/80" aria-hidden />
                      Pickup Time
                    </label>
                    <select
                      id="modal-pickup-time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select time</option>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="modal-dropoff-time" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-1.5">
                      <Clock className="h-4 w-4 text-gold/80" aria-hidden />
                      Drop-off Time
                    </label>
                    <select
                      id="modal-dropoff-time"
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select time</option>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-address" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-1.5">
                    <MapPin className="h-4 w-4 text-gold/80" aria-hidden />
                    Address
                  </label>
                  <input
                    id="modal-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Delivery or collection location"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="modal-name" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-1.5">
                    <User className="h-4 w-4 text-gold/80" aria-hidden />
                    Full Name
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="modal-phone" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-1.5">
                    <Phone className="h-4 w-4 text-gold/80" aria-hidden />
                    Phone Number
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 ..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="modal-car" className="flex items-center gap-2 text-sm font-medium text-white/80 mb-1.5">
                    <Car className="h-4 w-4 text-gold/80" aria-hidden />
                    Select Car
                  </label>
                  <select
                    id="modal-car"
                    value={selectedCar}
                    onChange={(e) => setSelectedCar(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Choose a car</option>
                    {cars.map((car) => (
                      <option key={car.car_id} value={car.title}>
                        {car.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl border border-white/20 px-4 py-3.5 text-white/90 hover:bg-white/5 transition-colors min-h-[48px]"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl bg-gold px-4 py-3.5 font-semibold text-matte-black hover:bg-gold/90 transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-charcoal min-h-[48px]"
                  >
                    Confirm Booking
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
