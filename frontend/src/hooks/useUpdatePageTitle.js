import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePageTitle } from "../helper/api";

export default function useUpdatePageTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, updatedData }) =>
      updatePageTitle(pageId, updatedData),

    onMutate: async ({ pageId, updatedData }) => {
      await queryClient.cancelQueries(["page", pageId]);

      const prevPage = queryClient.getQueryData(["page", pageId]);
      const prevSections = queryClient.getQueryData(["sections"]);

      // Optimistic update for the page
      queryClient.setQueryData(["page", pageId], (old) => ({
        ...old,
        ...updatedData,
      }));

      // Update sections (if they contain pages)
      queryClient.setQueryData(["sections"], (old) =>
        old?.map((sec) =>
          sec?.pages
            ? {
                ...sec,
                pages: sec.pages.map((p) =>
                  p._id === pageId ? { ...p, title: updatedData.title } : p
                ),
              }
            : sec
        )
      );

      return { prevPage, prevSections };
    },

    onError: (error, variables, context) => {
      // rollback
      if (context?.prevPage) {
        queryClient.setQueryData(["page", variables.pageId], context.prevPage);
      }
      if (context?.prevSections) {
        queryClient.setQueryData(["sections"], context.prevSections);
      }
      console.error("❌ Error updating page title:", error);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["sections"]);
      queryClient.invalidateQueries(["page", variables.pageId]);
    },
  });
}
