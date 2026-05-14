import { getPage } from "../helper/api";
import { useQuery } from "@tanstack/react-query";
import NoteEditorSkeleton from "../skeletons/NoteEditorSkeleton";
import ErrorMessage from "../components/ErrorMessage";
import TitleEditor from "./TitleEditor";
import ContentEditor from "./ContentEditor";

const NoteEditor = ({ pageId }) => {
  const {
    data: page,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["page", pageId],
    queryFn: () => getPage(pageId),
  });

  if (isLoading) return <NoteEditorSkeleton />;
  if (error) return <ErrorMessage />;

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <TitleEditor title={page?.title} pageId={pageId} />
        <ContentEditor
          content={page?.content}
          title={page?.title}
          pageId={pageId}
        />
      </div>
    </div>
  );
};

export default NoteEditor;
