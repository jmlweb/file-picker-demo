import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { type IntegrationName } from './config';

interface CurrentIntegrationState {
  currentIntegration: IntegrationName | null;
  setCurrentIntegration: (integration: IntegrationName) => void;
  resetCurrentIntegration: () => void;
}

export const useCurrentIntegrationStore = create<CurrentIntegrationState>()(
  devtools((set) => ({
    currentIntegration: null,
    setCurrentIntegration: (integration) =>
      set({ currentIntegration: integration }),
    resetCurrentIntegration: () => set({ currentIntegration: null }),
  })),
);
