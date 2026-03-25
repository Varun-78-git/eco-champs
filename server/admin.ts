
import { database } from './database';
import type { Submission } from '../types';

// This file simulates a secure, server-side-only module for administrative purposes.
// Access to these functions would be restricted to authorized admins in a real application.

/**
 * Retrieves all submissions from all users.
 * NOTE: This is an administrative function and should only be exposed
 * on a secure, internal-facing admin panel or API endpoint.
 * @returns A promise that resolves to an array of all submissions.
 */
export const viewAllSubmissions = async (): Promise<Submission[]> => {
    // Simulate a network delay for the admin panel
    await new Promise(res => setTimeout(res, 200));
    
    // Returns a copy of all submissions
    // fix: Correctly access submissions via the exported 'database' service instance.
    return [...database.collections.submissions];
};
