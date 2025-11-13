import { v4 as uuidv4 } from 'uuid';

// Helper function to generate a UUID
export function generateUUID(): string {
    return uuidv4();
}