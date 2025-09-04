export type Status = "freshman" | "sophomore" | "junior" | "senior";

export interface UserInfo {
  name: string;
  section: string;
  status: Status;
}

export interface ImagePosition {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

export interface AppState {
  step: "landing" | "questionnaire" | "upload" | "preview";
  userInfo: UserInfo | null;
  uploadedImage: string | null;
  imagePosition: ImagePosition | null;
  processedImage: string | null;
}

export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
];

export const FRAME_PATHS: Record<Status, string> = {
  freshman: "/frames/freshman-frame.svg",
  sophomore: "/frames/sophomore-frame.svg",
  junior: "/frames/junior-frame.svg",
  senior: "/frames/senior-frame.svg",
};
