import { create } from "zustand";

const usePageStore = create((set) => ({
  currentPage: null,
  initialLoad: false,
  currentCanvas: null,
  setCurrentCanvas: (canvas, initialLoad = false) =>
    set({
      currentCanvas: canvas,
      currentPage: null,
      initialLoad,
    }),
  setCurrentPage: (page, initialLoad = false) =>
    set({
      currentPage: page,
      currentCanvas: null,
      initialLoad,
    }),
  clearCurrentPage: () =>
    set({
      currentPage: null,
      currentCanvas: null,
    }),
  clearInitialLoad: () =>
    set({
      initialLoad: false,
    }),
}));

export default usePageStore;
