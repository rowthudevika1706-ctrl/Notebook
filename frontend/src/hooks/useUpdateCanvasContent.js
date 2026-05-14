import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCanvasContent } from "../helper/api";

const useUpdateCanvasContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ canvasId, updatedData }) =>
      updateCanvasContent(canvasId, updatedData),
    onMutate: async ({ canvasId, updatedData }) => {
      await queryClient.cancelQueries(["canvas", canvasId]);
      const previousPage = queryClient.getQueryData(["canvas", canvasId]);
      queryClient.setQueryData(["canvas", canvasId], (old) => ({
        ...old,
        ...updatedData,
      }));
      return { previousPage };
    },
    onError: (error, variables, context) => {
      if (context?.previousPage) {
        queryClient.setQueryData(
          ["canvas", variables.canvasId],
          context.previousPage
        );
      }
      console.error("❌ Error updating canvas:", error);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["canvas", variables.canvasId]);
    },
  });
};

export default useUpdateCanvasContent;
