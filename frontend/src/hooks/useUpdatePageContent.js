import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePageContent } from "../helper/api";

const useUpdatePageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, updatedData }) =>
      updatePageContent(pageId, updatedData),
    onMutate: async ({ pageId, updatedData }) => {
      await queryClient.cancelQueries(["page", pageId]);
      const previousPage = queryClient.getQueryData(["page", pageId]);
      queryClient.setQueryData(["page", pageId], (old) => ({
        ...old,
        ...updatedData,
      }));
      return { previousPage };
    },
    onError: (error, variables, context) => {
      if (context?.previousPage) {
        queryClient.setQueryData(
          ["page", variables.pageId],
          context.previousPage
        );
      }
      console.error("❌ Error updating page:", error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["page", variables.pageId]);
    },
  });
};

export default useUpdatePageContent;
