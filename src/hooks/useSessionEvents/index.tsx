"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { message } from "antd";

interface SessionEvent {
  event: string;
  data: {
    message?: string;
    timestamp?: string;
  };
}

export const useSessionEvents = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run on client side and if user is authenticated
    if (
      typeof window === "undefined" ||
      status !== "authenticated" ||
      !session?.user?.id
    ) {
      return;
    }

    const connectToSessionEvents = () => {
      try {
        // Close existing connection if any
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        const eventSource = new EventSource("/api/auth/sessions/events");
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        eventSource.onmessage = (event) => {
          try {
            const sessionEvent: SessionEvent = JSON.parse(event.data);

            switch (sessionEvent.event) {
              case "session_invalidated":
                console.log(
                  "Session invalidation received:",
                  sessionEvent.data
                );
                handleSessionInvalidation(sessionEvent.data.message);
                break;
              case "ping":
                console.log("Session ping received");
                break;
              case "connected":
                console.log("Session events connected successfully");
                break;
              default:
                console.log("Unknown session event:", sessionEvent);
            }
          } catch (error) {
            console.error("Error parsing session event:", error);
          }
        };

        eventSource.onerror = (error) => {
          console.error("Session events connection error:", error);
          eventSource.close();

          // Attempt to reconnect after 5 seconds
          if (!reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log("Attempting to reconnect to session events...");
              connectToSessionEvents();
            }, 5000);
          }
        };
      } catch (error) {
        console.error("Failed to connect to session events:", error);
      }
    };

    const handleSessionInvalidation = (notificationMessage?: string) => {
      // Show notification to user
      message.error(
        notificationMessage || "Sizin sessiyanız admin tərəfindən ləğv edildi"
      );

      // Sign out the user
      signOut({
        redirect: false,
        callbackUrl: "/auth/login",
      }).then(() => {
        // Redirect to login page
        router.push("/auth/login");
      });
    };

    // Connect to session events
    connectToSessionEvents();

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [session?.user?.id, status, router]);

  // Return connection status for debugging
  return {
    isConnected:
      typeof window !== "undefined" &&
      eventSourceRef.current?.readyState === EventSource.OPEN,
  };
};
