import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePage } from "../helper/api";
import usePageStore from "../store/usePageStore";

export default function useDeletePage() {
  const queryClient = useQueryClient();
  const clearCurrentPage = usePageStore((s) => s.clearCurrentPage);
  const currentPage = usePageStore((s) => s.currentPage);

  return useMutation({
    mutationFn: ({ sectionId, pageId }) => deletePage(sectionId, pageId),

    onMutate: async ({ sectionId, pageId }) => {
      if (currentPage === pageId) clearCurrentPage();

      const previousSections = queryClient.getQueryData(["sections"]);

      queryClient.setQueryData(["sections"], (old) =>
        old?.map((sec) =>
          sec._id === sectionId
            ? { ...sec, pages: sec.pages.filter((p) => p._id !== pageId) }
            : sec
        )
      );

      return { previousSections };
    },

    onError: (err, variables, context) => {
      if (context?.previousSections) {
        queryClient.setQueryData(["sections"], context.previousSections);
      }
      console.error("❌ Error deleting page:", err);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["sections"]);
    },
  });
}
