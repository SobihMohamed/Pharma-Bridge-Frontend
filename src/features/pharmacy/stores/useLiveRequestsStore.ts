import { create } from 'zustand';
import { LivePharmacyRequest } from '../types';

interface LiveRequestsState {
  liveRequests: LivePharmacyRequest[];
  addLiveRequest: (request: LivePharmacyRequest) => void;
  removeRequest: (id: number) => void;
  clearLiveRequests: () => void;
}

export const useLiveRequestsStore = create<LiveRequestsState>((set) => ({
  liveRequests: [],

  addLiveRequest: (request) =>
    set((state) => {
      // Prevent duplicates
      if (state.liveRequests.some((r) => r.id === request.id)) return state;
      return { liveRequests: [request, ...state.liveRequests] };
    }),

  removeRequest: (id) =>
    set((state) => ({
      liveRequests: state.liveRequests.filter((r) => r.id !== id),
    })),

  clearLiveRequests: () => set({ liveRequests: [] }),
}));
