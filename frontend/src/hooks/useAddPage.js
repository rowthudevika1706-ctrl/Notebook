import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPage } from "../helper/api";
import usePageStore from "../store/usePageStore";

export default function useAddPage() {
  const queryClient = useQueryClient();
  const setCurrentPage = usePageStore((s) => s.setCurrentPage);

  return useMutation({
    mutationFn: (page) => createPage(page),
    onMutate: async ({ sectionId, title, pageId }) => {
      const previousSections = queryClient.getQueryData(["sections"]);
      queryClient.setQueryData(["sections"], (old) =>
        old.map((sec) =>
          sec._id === sectionId
            ? {
                ...sec,
                pages: [...sec.pages, { _id: pageId, title, sectionId }],
              }
            : sec
        )
      );
      setCurrentPage(pageId, false);
      return { previousSections };
    },
    onError: (err, variables, context) => {
      setCurrentPage(null);
      if (context?.previousSections) {
        queryClient.setQueryData(["sections"], context.previousSections);
      }
    },
    onSuccess: () => queryClient.invalidateQueries(["sections"]),
  });
}
