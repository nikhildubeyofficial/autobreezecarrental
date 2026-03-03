"use client";

import { BookModalProvider } from "@/contexts/BookModalContext";
import PageTransition from "./PageTransition";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <BookModalProvider>
      <PageTransition>{children}</PageTransition>
    </BookModalProvider>
  );
}
