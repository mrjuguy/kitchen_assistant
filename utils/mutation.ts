/**
 * Centralized utilities for mutation operations.
 * Provides consistent auth checking and error handling across all hooks.
 * @module utils/mutation
 */

import { supabase } from "../services/supabase";
import { Household } from "../types/schema";

// ============================================================================
// Custom Error Types
// ============================================================================

/**
 * Error thrown when a user is not authenticated.
 * Use this for operations that require a valid Supabase session.
 */
export class AuthError extends Error {
  constructor(message = "User not authenticated") {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Error thrown when no household is selected.
 * Use this for operations that require household context.
 */
export class HouseholdError extends Error {
  constructor(message = "No household selected") {
    super(message);
    this.name = "HouseholdError";
  }
}

// ============================================================================
// Auth Utilities
// ============================================================================

/**
 * Fetches and validates the current authenticated user.
 * @throws {AuthError} If no user is currently authenticated.
 * @returns The authenticated user object.
 */
export async function requireAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthError();
  }

  return user;
}

/**
 * Validates that a household is currently selected.
 * @param household - The current household from useCurrentHousehold hook.
 * @throws {HouseholdError} If no household is selected.
 * @returns The validated household object.
 */
export function requireHousehold(
  household: Household | null | undefined,
): Household {
  if (!household) {
    throw new HouseholdError();
  }

  return household;
}

/**
 * Combined check for both auth and household requirements.
 * Use this in mutations that need both user ID and household ID.
 * @param household - The current household from useCurrentHousehold hook.
 * @throws {AuthError} If no user is currently authenticated.
 * @throws {HouseholdError} If no household is selected.
 * @returns Object containing both user and household.
 */
export async function requireAuthAndHousehold(
  household: Household | null | undefined,
) {
  const user = await requireAuth();
  const validHousehold = requireHousehold(household);

  return { user, household: validHousehold };
}

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Standardized mutation error handler.
 * Logs errors consistently and can be extended for analytics/reporting.
 * @param error - The error caught in a mutation.
 * @param context - Optional context string for debugging (e.g., "useAddPantryItem").
 */
export function handleMutationError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : "[Mutation]";

  if (error instanceof AuthError) {
    console.error(`${prefix} Auth error:`, error.message);
  } else if (error instanceof HouseholdError) {
    console.error(`${prefix} Household error:`, error.message);
  } else if (error instanceof Error) {
    console.error(`${prefix} Error:`, error.message);
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}

/**
 * Type guard to check if an error is an AuthError.
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

/**
 * Type guard to check if an error is a HouseholdError.
 */
export function isHouseholdError(error: unknown): error is HouseholdError {
  return error instanceof HouseholdError;
}
