import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSection } from "../helper/api";
import usePageStore from "../store/usePageStore";

export default function useDeleteSection() {
  const queryClient = useQueryClient();
  const currentPage = usePageStore((s) => s.currentPage);
  const setCurrentPage = usePageStore((s) => s.setCurrentPage);

  return useMutation({
    mutationFn: (sectionId) => deleteSection(sectionId),
    onMutate: async (sectionId) => {
      if (currentPage) setCurrentPage(null);
      const previousSections = queryClient.getQueryData(["sections"]);
      queryClient.setQueryData(["sections"], (old) =>
        old.filter((sec) => sec._id !== sectionId)
      );
      return { previousSections };
    },
    onError: (err, sectionId, context) => {
      if (context?.previousSections) {
        queryClient.setQueryData(["sections"], context.previousSections);
      }
    },
    onSuccess: () => queryClient.invalidateQueries(["sections"]),
  });
}
