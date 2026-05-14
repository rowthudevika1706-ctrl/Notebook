import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";
import useUpdatePageTitle from "../hooks/useUpdatePageTitle.js"; // note .js extension

const TitleEditor = ({ title, pageId }) => {
  const [localTitle, setLocalTitle] = useState(title);
  const { mutate: updatePageMutate, isLoading } = useUpdatePageTitle();

  const debouncedUpdate = useCallback(
    debounce((value) => {
      updatePageMutate({
        pageId,
        updatedData: { title: value },
      });
    }, 500),
    [pageId, updatePageMutate]
  );

  const handleChange = (value) => {
    setLocalTitle(value);
    debouncedUpdate(value);
  };

  return (
    <>
      <Input
        value={localTitle}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Page Title"
        className="text-3xl font-bold border-0 bg-transparent px-2 mb-4 focus-visible:ring-0"
      />
      {isLoading && (
        <p className="text-sm text-gray-500 mt-2 animate-pulse">Saving...</p>
      )}
    </>
  );
};

export default TitleEditor;
