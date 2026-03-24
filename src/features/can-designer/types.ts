export type DesignerMode = "image" | "text";
export type Step = "front" | "back" | "info" | "social";

export interface Texture {
    id: string;
    label: string;
    src: string;
  }
   
  export interface Color {
    id: string;
    label: string;
    hex: string;
  }
   
  export interface Option {
    id: string;
    label: string;
  }