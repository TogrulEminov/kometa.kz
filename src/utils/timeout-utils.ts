// src/lib/utils/timeout-utils.ts

/**
 * ✅ Timeout Utilities
 * Bu faylda bütün timeout funksiyaları toplanıb
 */

// ============================================
// Environment-based timeout configurations
// ============================================

export const TIMEOUTS = {
  // Database
  DATABASE_QUERY: parseInt(process.env.DATABASE_TIMEOUT || "10000", 10),
  DATABASE_CONNECTION: parseInt(
    process.env.DATABASE_CONNECTION_TIMEOUT || "20000",
    10
  ),

  // API & Server Actions
  API_ROUTE: parseInt(process.env.API_TIMEOUT || "30000", 10),
  SERVER_ACTION: parseInt(process.env.SERVER_ACTION_TIMEOUT || "15000", 10),

  // Metadata & Middleware
  METADATA_FETCH: parseInt(process.env.METADATA_TIMEOUT || "5000", 10),
  MIDDLEWARE: parseInt(process.env.MIDDLEWARE_TIMEOUT || "5000", 10),

  // External API calls
  EXTERNAL_API: 10000, // 10 seconds

  // File operations
  FILE_UPLOAD: 30000, // 30 seconds
  FILE_READ: 5000, // 5 seconds
} as const;

// ============================================
// Generic timeout wrapper
// ============================================

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage?: string
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(errorMessage || `Operation timeout after ${timeoutMs}ms`)
      );
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

// ============================================
// Server Action timeout wrapper
// ============================================

interface ServerActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function withServerActionTimeout<T>(
  action: () => Promise<T>,
  timeoutMs: number = TIMEOUTS.SERVER_ACTION
): Promise<ServerActionResult<T>> {
  try {
    const data = await withTimeout(
      action(),
      timeoutMs,
      `Server action timeout after ${timeoutMs}ms`
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Server action failed",
    };
  }
}

// ============================================
// API Route timeout wrapper
// ============================================

import { NextResponse } from "next/server";

export async function withApiTimeout<T>(
  handler: () => Promise<T>,
  timeoutMs: number = TIMEOUTS.API_ROUTE
): Promise<NextResponse> {
  try {
    const data = await withTimeout(
      handler(),
      timeoutMs,
      `API timeout after ${timeoutMs}ms`
    );

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ API Error:", error);

    const isTimeout =
      error instanceof Error && error.message.includes("timeout");

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "API request failed",
      },
      { status: isTimeout ? 408 : 500 }
    );
  }
}

// ============================================
// Database query timeout wrapper
// ============================================

export async function withDatabaseTimeout<T>(
  query: () => Promise<T>,
  timeoutMs: number = TIMEOUTS.DATABASE_QUERY
): Promise<T> {
  return withTimeout(
    query(),
    timeoutMs,
    `Database query timeout after ${timeoutMs}ms`
  );
}

// ============================================
// Metadata fetch timeout wrapper
// ============================================

export async function withMetadataTimeout<T>(
  fetchFn: () => Promise<T>,
  timeoutMs: number = TIMEOUTS.METADATA_FETCH
): Promise<T | null> {
  try {
    return await withTimeout(
      fetchFn(), // ✅ Function call edilir - Promise qaytarır
      timeoutMs,
      `Metadata fetch timeout after ${timeoutMs}ms`
    );
  } catch (error) {
    console.error("❌ Metadata fetch error:", error);
    return null;
  }
}

// ============================================
// Retry with exponential backoff
// ============================================

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 100,
    maxDelay = 5000,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (!shouldRetry(error) || attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);

      console.warn(
        `⚠️  Retry attempt ${attempt}/${maxRetries} after ${delay}ms`,
        error instanceof Error ? error.message : error
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// ============================================
// Request body parser with timeout
// ============================================

import { NextRequest } from "next/server";

export async function parseRequestBody<T>(
  request: NextRequest,
  timeoutMs: number = 5000
): Promise<T> {
  return withTimeout(
    (async () => {
      try {
        const body = await request.json();
        return body as T;
      } catch (error) {
        throw new Error("Invalid request body");
      }
    })(), // ✅ IIFE - Immediately Invoked Function Expression
    timeoutMs
  );
}

// ============================================
// Performance monitoring wrapper
// ============================================

export async function withPerformanceMonitoring<T>(
  operation: string,
  fn: () => Promise<T>,
  warnThresholdMs: number = 1000
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - startTime;

    if (duration > warnThresholdMs) {
      console.warn(`🐌 Slow operation: ${operation} (${duration}ms)`);
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`⏱️  ${operation}: ${duration}ms`);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Operation failed: ${operation} (${duration}ms)`, error);
    throw error;
  }
}

// ============================================
// Circuit breaker pattern (advanced)
// ============================================

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "CLOSED";
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = "OPEN";
      console.error(`🔴 Circuit breaker OPEN after ${this.failures} failures`);
    }
  }

  getState() {
    return this.state;
  }
}

export const databaseCircuitBreaker = new CircuitBreaker(5, 60000);

// ============================================
// Helper: Check if error is timeout
// ============================================

export function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("timeout") || error.message.includes("ETIMEDOUT"))
  );
}

// ============================================
// Helper: Check if error is connection error
// ============================================

export function isConnectionError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message.includes("ECONNREFUSED") ||
      error.message.includes("ENOTFOUND") ||
      error.message.includes("ECONNRESET") ||
      error.message.includes("Can't reach database") ||
      error.message.includes("P1001"))
  );
}
