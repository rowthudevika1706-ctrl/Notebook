import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react'
import useUpdateCanvasTitle from '../hooks/useUpdateCanvasTitle.js';
import { Input } from "@/components/ui/input";

const CanvasTitle = ({ title, canvasId }) => {
   const [localTitle, setLocalTitle] = useState(title);
    const { mutate: updatePageMutate, isLoading } = useUpdateCanvasTitle();
  
    const debouncedUpdate = useCallback(
      debounce((value) => {
        updatePageMutate({
          canvasId,
          updatedData: { title: value },
        });
      }, 500),
      [canvasId, updatePageMutate]
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
          placeholder="drawing Title"
          className="text-3xl font-bold border-0 bg-transparent px-2 mb-4 focus-visible:ring-0"
        />
        {isLoading && (
          <p className="text-sm text-gray-500 mt-2 animate-pulse">Saving...</p>
        )}
      </>
    );
};

export default CanvasTitle
