import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCanvasTitle } from "../helper/api";

export default function useUpdateCanvasTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ canvasId, updatedData }) =>
      updateCanvasTitle(canvasId, updatedData),

    onMutate: async ({ canvasId, updatedData }) => {
      await queryClient.cancelQueries(["canvas", canvasId]);

      const prevPage = queryClient.getQueryData(["canvas", canvasId]);
      const prevSections = queryClient.getQueryData(["sections"]);

      // Optimistic update for the page
      queryClient.setQueryData(["canvas", canvasId], (old) => ({
        ...old,
        ...updatedData,
      }));

      // Update sections (if they contain pages)
      if ("title" in updatedData) {
        queryClient.setQueryData(["sections"], (old) =>
          old?.map((sec) =>
            sec.canvases
              ? {
                  ...sec,
                  canvases: sec.canvases.map((c) =>
                    c._id === canvasId ? { ...c, title: updatedData.title } : c
                  ),
                }
              : sec
          )
        );
      }

      return { prevPage, prevSections };
    },

    onError: (error, variables, context) => {
      // rollback
      if (context?.prevPage) {
        queryClient.setQueryData(
          ["canvas", variables.canvasId],
          context.prevPage
        );
      }
      if (context?.prevSections) {
        queryClient.setQueryData(["sections"], context.prevSections);
      }
      console.error("❌ Error updating canvas title:", error);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["sections"]);
      queryClient.invalidateQueries(["canvas", variables.canvasId]);
    },
  });
}
