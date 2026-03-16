import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  standups: [],
  selectedStandup: null,
  actionItems: [],
  decisions: [],
  ticketLinks: [],
  youtrackIssues: [],
  settings: null,
  loading: {},
  errors: {},

  setLoading: (key, val) => set(s => ({ loading: { ...s.loading, [key]: val } })),
  setError: (key, val) => set(s => ({ errors: { ...s.errors, [key]: val } })),

  setStandups: (standups) => set({ standups }),
  setSelectedStandup: (standup) => set({ selectedStandup: standup }),
  setActionItems: (actionItems) => set({ actionItems }),
  setDecisions: (decisions) => set({ decisions }),
  setTicketLinks: (ticketLinks) => set({ ticketLinks }),
  setYoutrackIssues: (youtrackIssues) => set({ youtrackIssues }),
  setSettings: (settings) => set({ settings }),

  addTicketLink: (link) => set(s => ({ ticketLinks: [...s.ticketLinks, link] })),
  removeTicketLink: (linkId) => set(s => ({
    ticketLinks: s.ticketLinks.filter(l => l._id !== linkId)
  })),
  updateActionItem: (item) => set(s => ({
    actionItems: s.actionItems.map(i => i._id === item._id ? item : i)
  })),
  updateDecision: (item) => set(s => ({
    decisions: s.decisions.map(i => i._id === item._id ? item : i)
  })),
  removeActionItem: (id) => set(s => ({
    actionItems: s.actionItems.filter(i => i._id !== id)
  })),
  removeDecision: (id) => set(s => ({
    decisions: s.decisions.filter(i => i._id !== id)
  })),
}));

export default useAppStore;
