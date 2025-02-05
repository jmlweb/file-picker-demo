import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Constants
const TWO_MINUTES_MS = 2 * 60 * 1000;

// Types
type OpType = 'add' | 'remove';

interface PendingOp {
  type: OpType;
  date: number;
}

interface KbStore {
  pendingOps: Record<string, PendingOp>;
  addPendingOps: (ops: Record<string, OpType>) => void;
  removePendingOps: (ids: string[]) => void;
}

// Helpers
function isExpired(date: number, now: number): boolean {
  return now - date > TWO_MINUTES_MS;
}

function filterExpiredOps(
  ops: Record<string, PendingOp>,
  now: number,
): Record<string, PendingOp> {
  return Object.fromEntries(
    Object.entries(ops).filter(([, op]) => !isExpired(op.date, now)),
  );
}

// Store
export const useKbPendingOpsStore = create<KbStore>()(
  persist(
    (set) => ({
      pendingOps: {},
      addPendingOps: (ops) => {
        set((state) => {
          const now = Date.now();
          const filteredOps = filterExpiredOps(state.pendingOps, now);

          const newOps = Object.fromEntries(
            Object.entries(ops).map(([id, type]) => [
              id,
              { type, date: now } as PendingOp,
            ]),
          );

          return {
            pendingOps: { ...filteredOps, ...newOps },
          };
        });
      },
      removePendingOps: (ids) => {
        set((state) => {
          const now = Date.now();
          const newPendingOps = Object.fromEntries(
            Object.entries(state.pendingOps).filter(
              ([id, op]) => !isExpired(op.date, now) && !ids.includes(id),
            ),
          );
          return { pendingOps: newPendingOps };
        });
      },
    }),
    {
      name: 'kb-pending-ops',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
