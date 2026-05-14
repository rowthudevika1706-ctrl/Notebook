import React, { useState, useCallback, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import debounce from "lodash.debounce";
import useUpdatePageContent from "../hooks/useUpdatePageContent.js";
import useUpdatePageTitle from "../hooks/useUpdatePageTitle.js";
import { toPng } from "html-to-image";
import { generateAiNote } from "../helper/api";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ListSkeleton from "../skeletons/ListSkeleton.jsx";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Mic, MicOff } from "lucide-react";

const ContentEditor = ({ content, title, pageId }) => {
  const [localContent, setLocalContent] = useState(content);
  const [isLoadingAI, setLoadingAI] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const inputRef = useRef(null);
  const lastFinalRef = useRef(""); // Track processed final transcript

  const { mutate: updatePageMutate, isPending } = useUpdatePageContent();
  const { mutate: updatePageTitleMutate } = useUpdatePageTitle();

  const {
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Debounced save to backend
  const debouncedUpdate = useCallback(
    debounce((value) => {
      updatePageMutate({ pageId, updatedData: { content: value } });
    }, 1000),
    [pageId, updatePageMutate]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => debouncedUpdate.cancel();
  }, [debouncedUpdate]);

  // === SPEECH TO PARAGRAPHS ===
  useEffect(() => {
    if (!listening) {
      lastFinalRef.current = "";
      return;
    }

    const newFinal = finalTranscript.trim();
    if (!newFinal || newFinal === lastFinalRef.current) return;

    // Extract only the NEW final text
    const addedText = newFinal.slice(lastFinalRef.current.length).trim();
    if (!addedText) return;

    // Split into sentences using punctuation
    const sentences = addedText
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (sentences.length === 0) return;

    // Convert to HTML paragraphs
    const htmlParagraphs = sentences
      .map(
        (sentence) =>
          `<p>${sentence.charAt(0).toUpperCase() + sentence.slice(1)}</p>`
      )
      .join("");

    // Append to editor
    setLocalContent((prev) => {
      const updated =
        prev.endsWith("</p>") || !prev
          ? prev + htmlParagraphs
          : prev + "<p></p>" + htmlParagraphs;
      debouncedUpdate(updated);
      return updated;
    });

    // Update reference
    lastFinalRef.current = newFinal;
  }, [finalTranscript, listening, debouncedUpdate]);

  // Reset on stop
  useEffect(() => {
    if (!listening) {
      resetTranscript();
      lastFinalRef.current = "";
    }
  }, [listening, resetTranscript]);

  // === MIC CONTROLS ===
  const handleStart = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser does not support speech recognition");
      return;
    }
    resetTranscript();
    lastFinalRef.current = "";
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };

  // === MANUAL EDITOR CHANGE ===
  const handleChange = (value) => {
    setLocalContent(value);
    debouncedUpdate(value);
  };

  // === AI GENERATE ===
  const handleGenerate = async () => {
    if (isLoadingAI) return;
    const prompt = inputRef.current?.value?.trim();
    if (!prompt) return;

    setLoadingAI(true);
    try {
      const response = await generateAiNote({
        prompt,
        noteContent: localContent,
      });

      if (response?.content) {
        const newContent =
          response.method === "write"
            ? response.content
            : localContent + response.content;

        setLocalContent(newContent);
        debouncedUpdate(newContent);

        if (title.startsWith("New Note") && response.title) {
          updatePageTitleMutate({
            pageId,
            updatedData: { title: response.title },
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate with AI.");
    } finally {
      setLoadingAI(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // === DOWNLOAD AS PNG ===
  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      const editorNode = document.querySelector(".my-editor .ql-editor");
      if (!editorNode) throw new Error("Editor not found");

      const prevBg = editorNode.style.background;
      const prevColor = editorNode.style.color;
      editorNode.style.background = "#ffffff";
      editorNode.style.color = "#000000";

      await new Promise((r) => setTimeout(r, 150));

      const dataUrl = await toPng(editorNode, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });

      const link = document.createElement("a");
      link.download = `${title || "note"}.png`;
      link.href = dataUrl;
      link.click();

      // Restore styles
      editorNode.style.background = prevBg;
      editorNode.style.color = prevColor;

      toast.success("Note downloaded as image!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download image.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative">
      {/* Editor + Mic Button */}
      {isLoadingAI ? (
        <ListSkeleton />
      ) : (
        <div className="">
          {/* Mic Button */}
          <div className="absolute -top-13 right-0 z-10">
            {listening ? (
              <Button variant="outline" size="icon" onClick={handleStop}>
                <Mic className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="outline" size="icon" onClick={handleStart}>
                <MicOff className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Quill Editor */}
          <ReactQuill
            className="my-editor"
            theme="snow"
            value={localContent}
            onChange={handleChange}
            placeholder="Start speaking or typing..."
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                ["link"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
              ],
            }}
            style={{ height: "100%" }}
          />
        </div>
      )}

      {/* AI Input + Generate + Download */}
      <div className="flex gap-2 mt-4">
        <div className="peer group/generate flex items-center gap-2 flex-1">
          <Input
            ref={inputRef}
            className="w-0 transition-all p-0 border-0 duration-500 ease-in-out 
                       group-hover/generate:w-full group-hover/generate:border 
                       group-hover/generate:p-3 focus-visible:w-full focus-visible:border 
                       focus-visible:p-3 focus-visible:ring-0"
            placeholder="Ask AI to write or improve..."
          />
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={isLoadingAI}
            className="whitespace-nowrap"
          >
            {isLoadingAI ? "Generating..." : "Generate"}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={downloading || isLoadingAI}
          className="peer-hover/generate:hidden transition-opacity"
        >
          {downloading ? "Downloading..." : "Download"}
        </Button>
      </div>

      {/* Saving Indicator */}
      {isPending && (
        <p className="text-sm text-gray-500 mt-2 animate-pulse">Saving...</p>
      )}
    </div>
  );
};

export default ContentEditor;
