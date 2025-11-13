import { NextResponse } from "next/server";

type Nullable<T> = T | null | undefined;

export interface ValidationIssue {
  field?: string;
  message: string;
  code?: string;
}

export interface SuccessBody<T = any> {
  message: string;
  data?: T;
  paginations?: any;
}

export interface ErrorBody {
  message: string;
  code?: string;
  errors?: ValidationIssue[];
}

export const apiSuccess = <T = any>(
  body: SuccessBody<T>,
  init?: ResponseInit
) => {
  const status = init?.status ?? 200;
  return NextResponse.json(body, { status });
};

export const apiCreated = <T = any>(body: SuccessBody<T>) => {
  return NextResponse.json(body, { status: 201 });
};

export const apiBadRequest = (body: ErrorBody) => {
  return NextResponse.json(body, { status: 400 });
};

export const apiUnauthorized = (body: ErrorBody) => {
  return NextResponse.json(body, { status: 401 });
};

export const apiForbidden = (body: ErrorBody) => {
  return NextResponse.json(body, { status: 403 });
};

export const apiNotFound = (body: ErrorBody) => {
  return NextResponse.json(body, { status: 404 });
};

export const apiServerError = (body: ErrorBody, error?: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("API Error:", error);
  }
  return NextResponse.json(body, { status: 500 });
};

export const extractZodIssues = (
  issues: Nullable<any>
): ValidationIssue[] | undefined => {
  if (!issues) return undefined;
  try {
    return issues.map((i: any) => ({
      field: Array.isArray(i.path) ? i.path.join(".") : undefined,
      message: i.message,
      code: i.code,
    }));
  } catch {
    return undefined;
  }
};
