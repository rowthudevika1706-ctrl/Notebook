import axios from "axios";
import { toast } from "sonner";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// -------------------- Interceptors --------------------
// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.authorization = `Bearer ${token}`;
  return req;
});

// Handle global errors
API.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "An error occurred";

    if (status === 444) {
      // Session expired
      localStorage.removeItem("user-storage");
      localStorage.removeItem("token");
      window.location.href = "/auth";
      toast.error("Session expired. Please log in again.");
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

// -------------------- Auth APIs --------------------
export const auth_api = async (formData) => {
  const res = await API.post("/auth", formData);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const sendOTP = async (email) => {
  const res = await API.post("/forgot-password/send-otp", { email });
  return res.status >= 200 && res.status < 300;
};

export const verifyOTP = async ({ userId, otp }) => {
  const res = await API.post("/forgot-password/verify-otp", { userId, otp });
  return res.status === 200;
};

export const resetPassword = async ({ userId, password }) => {
  const res = await API.post("/forgot-password/reset", { userId, password });
  return res.status === 200;
};

export const updateUser = async (darkMode) => {
  console.log(darkMode);
  const res = await API.post("/update-user", { darkMode });
  return res.data.user;
};

// -------------------- Section APIs --------------------
export const createSection = async (section) => {
  const res = await API.post("section/create", section);
  return res.data;
};

export const getSections = async () => {
  const res = await API.get("section/");
  return res.data.section;
};

export const renameSection = async (sectionId, title) => {
  const res = await API.patch(`section/rename/${sectionId}`, { title });
  return res.data.section;
};

export const deleteSection = async (sectionId) => {
  const res = await API.delete(`section/${sectionId}`);
  return res.data;
};

// -------------------- Page APIs --------------------
export const createPage = async (page) => {
  const res = await API.post("page/create", page);
  return res.data;
};

export const getPage = async (pageId) => {
  const res = await API.get(`page/${pageId}`);
  return res.data.page;
};

export const updatePage = async (pageId, data) => {
  const res = await API.put(`page/${pageId}`, data);
  return res.data;
};

export const updatePageContent = async (pageId, data) => {
  const res = await API.patch(`page/content/${pageId}`, data);
  return res.data;
};

export const updatePageTitle = async (pageId, data) => {
  const res = await API.patch(`page/title/${pageId}`, data);
  return res.data;
};

export const deletePage = async (sectionId, pageId) => {
  const res = await API.delete(`page/${sectionId}/${pageId}`);
  return res.data;
};

// -------------------- Canvas APIs --------------------
export const createCanvas = async (canvas) => {
  const res = await API.post("canvas/create", canvas);
  return res.data.canvas;
};

export const getCanvas = async (canvasId) => {
  const res = await API.get(`canvas/${canvasId}`);
  return res.data.canvas;
};

export const updateCanvasTitle = async (canvasId, data) => {
  const res = await API.patch(`canvas/title/${canvasId}`, data);
  return res.data;
};

export const updateCanvasContent = async (canvasId, data) => {
  // console.log(canvasId,data)
  const res = await API.patch(`canvas/content/${canvasId}`, data);
  return res?.data?.canvas?.content;
};

export const deleteCanvas = async (sectionId, canvasId) => {
  const res = await API.delete(`canvas/${sectionId}/${canvasId}`);
  return res.data;
};

// -------------------- AI APIs --------------------
export const generateAiNote = async (data) => {
  const res = await API.post("/ai/generate-ai-note", data);
  return res.data.message;
};

export const generateCanvasDrawing = async (data) => {
  // console.log(data);
  const res = await API.post("/ai/generate-canvas-drawing", data);
  // console.log(res.data);
  // console.log("AI");
  return res.data.canvas;
};
