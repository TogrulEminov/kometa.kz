// src/utils/body-parser.ts

import { NextRequest } from "next/server";

export default async function parseForm(req: NextRequest): Promise<{ fields: { [key: string]: string | string[] }; files: { [key: string]: File | File[] } }> {
    const formData = await req.formData();

    const fields: { [key: string]: string | string[] } = {};
    const files: { [key: string]: File | File[] } = {};

    for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
            if (fields[key]) {
                if (Array.isArray(fields[key])) {
                    (fields[key] as string[]).push(value);
                } else {
                    fields[key] = [fields[key] as string, value];
                }
            } else {
                fields[key] = value;
            }
        } else if (value instanceof File) {
            if (files[key]) {
                if (Array.isArray(files[key])) {
                    (files[key] as File[]).push(value);
                } else {
                    files[key] = [files[key] as File, value];
                }
            } else {
                files[key] = value;
            }
        }
    }

    return { fields, files };
}