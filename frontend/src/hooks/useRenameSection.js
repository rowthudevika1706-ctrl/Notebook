import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameSection } from "../helper/api";

export default function useRenameSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }) => renameSection(id, title),
    onMutate: async ({ id, title }) => {
      const previousSections = queryClient.getQueryData(["sections"]);
      queryClient.setQueryData(["sections"], (old) =>
        old.map((sec) => (sec._id === id ? { ...sec, title } : sec))
      );
      return { previousSections };
    },
    onError: (err, variables, context) => {
      if (context?.previousSections) {
        queryClient.setQueryData(["sections"], context.previousSections);
      }
    },
    onSuccess: () => queryClient.invalidateQueries(["sections"]),
  });
}
