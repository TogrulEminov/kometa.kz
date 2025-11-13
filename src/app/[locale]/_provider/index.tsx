"use client";
import Footer from "@/src/ui-components/layout/footer";
import Header from "@/src/ui-components/layout/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

interface LocalLayoutProps {
  children: React.ReactNode;
}

export default function ProviderComponent({ children }: LocalLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="pt-[81px] lg:pt-[117px]">{children}</main>
      <Footer />
    </QueryClientProvider>
  );
}
