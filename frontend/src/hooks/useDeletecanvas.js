import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCanvas } from "../helper/api";
import usePageStore from "../store/usePageStore";

export default function useDeleteCanvas() {
  const queryClient = useQueryClient();
  const clearCurrentPage = usePageStore((s) => s.clearCurrentPage);
  const currentCanvas = usePageStore((s) => s.currentCanvas);

  return useMutation({
    mutationFn: ({ sectionId, canvasId }) => deleteCanvas(sectionId, canvasId),

    onMutate: async ({ sectionId, canvasId }) => {
      if (currentCanvas === canvasId) clearCurrentPage();

      const previousSections = queryClient.getQueryData(["sections"]);

      queryClient.setQueryData(["sections"], (old) =>
        old?.map((sec) =>
          sec._id === sectionId
            ? { ...sec, canvases: sec.canvases.filter((c) => c._id !== canvasId) }
            : sec
        )
      );

      return { previousSections };
    },

    onError: (err, variables, context) => {
      if (context?.previousSections) {
        queryClient.setQueryData(["sections"], context.previousSections);
      }
      console.error("❌ Error deleting canvas:", err);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["sections"]);
    },
  });
}
