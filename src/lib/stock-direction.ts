import type { MovementReason } from "@/db/schema";

/**
 * Which way each movement reason moves stock: +1 adds, -1 removes, 0 means the
 * admin types the sign (corrections can go either way). Shared by the form and
 * the server action so they always agree.
 */
export const stockDirection: Record<MovementReason, 1 | -1 | 0> = {
  restock: 1,
  return: 1,
  sale: -1,
  damage: -1,
  adjustment: 0,
};

/** The signed stock change for a quantity typed with a given reason. */
export const signedDelta = (reason: MovementReason, quantity: number) => {
  const direction = stockDirection[reason];
  return direction === 0 ? quantity : direction * Math.abs(quantity);
};
