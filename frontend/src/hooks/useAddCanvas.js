import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCanvas } from "../helper/api";
import usePageStore from "../store/usePageStore";

export default function useAddCanvas() {
  const queryClient = useQueryClient();
  const setCurrentCanvas = usePageStore((s) => s.setCurrentCanvas);

  return useMutation({
    mutationFn: (canvas) => createCanvas(canvas),
    onMutate: async ({ sectionId, title, canvasId }) => {
      const previousSections = queryClient.getQueryData(["sections"]);
      queryClient.setQueryData(["sections"], (old) =>
        old.map((sec) =>
          sec._id === sectionId
            ? {
                ...sec,
                canvases: [
                  ...sec.canvases,
                  { _id: canvasId, title, sectionId },
                ],
              }
            : sec
        )
      );
      setCurrentCanvas(canvasId, false);
      return { previousSections };
    },
    onError: (err, variables, context) => {
      setCurrentCanvas(null);
      if (context?.previousSections) {
        queryClient.setQueryData(["sections"], context.previousSections);
      }
    },
    onSuccess: () => queryClient.invalidateQueries(["sections"]),
  });
}
