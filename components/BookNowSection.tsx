"use client";

import { motion } from "framer-motion";
import RevealOnScroll from "./RevealOnScroll";
import { useBookModal } from "@/contexts/BookModalContext";

export default function BookNowSection() {
  const { openBookModal } = useBookModal();

  return (
    <section className="border-t border-white/10 py-20 bg-[#0A0A0A]">
      <RevealOnScroll className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-sans text-sm uppercase tracking-[0.3em] text-gold mb-2">
            Reserve
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Book Now
          </h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            Choose your dates, car, and we&apos;ll confirm your booking via WhatsApp.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <motion.button
            type="button"
            onClick={() => openBookModal()}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-gold px-10 py-4 font-semibold text-matte-black transition-all duration-300 hover:bg-gold/90 hover:shadow-glow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
          >
            Open Booking Form
          </motion.button>
        </motion.div>
      </RevealOnScroll>
    </section>
  );
}
