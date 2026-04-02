
 export const TEXTURES = [
  { id: "texture-1", label: "Texture 1", src: "../src/assets/textures/texture1.jpg" },
  { id: "texture-2", label: "Texture 2", src: "../src/assets/textures/texture2.jpg" },
  { id: "texture-3", label: "Texture 3", src: "../src/assets/textures/texture3.jpg" },
  { id: "texture-4", label: "Texture 4", src: "../src/assets/textures/texture4.jpg" },
];
 
export const COLORS = [
  { id: "color-1", label: "Red",   hex: "#E51236" },
  { id: "color-2", label: "Blue",  hex: "#001A52" },
  { id: "color-3", label: "Black", hex: "#121212" },
  { id: "color-4", label: "White", hex: "#ffffff" },
];

export const FONTS = [
  { id: "font-1", label: "Inter", src: "../src/assets/fonts/arial.ttf" },
  { id: "font-2", label: "Bitcount single", src: "../src/assets/fonts/times.ttf" },
  { id: "font-3", label: "Kewave", src: "../src/assets/fonts/courier.ttf" },
  { id: "font-4", label: "Instrument serif", src: "../src/assets/fonts/courier.ttf" },
];

export const TEXT_ALIGNMENT = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};
 
export const TAGS = [
  {
  category: "",
  items: [
  { id: "1", label: "UX" },
  { id: "2", label: "Backend" },
  { id: "3", label: "Frontend" },
  { id: "4", label: "Typografi" },
  { id: "5", label: "Ai" },
  { id: "6", label: "Motion" },
  { id: "7", label: "Fullstack" },
  ],
},
  {
  category: "Webbutveckling",
  items: [
  { id: "8", label: "Cms" },
  { id: "9", label: "React" },
  { id: "10", label: "Php" },
  { id: "11", label: "C#" },
  { id: "12", label: "Databaser" },
  ],
},
  {
    category: "Digital Design",
    items: [
    { id: "13", label: "Figma" },
    { id: "14", label: "Illustration" },
    { id: "15", label: "Ui" },
    { id: "16", label: "Framer" },
    { id: "17", label: "Design system" },
    ],
  }
];

export const TYPES = [
  { id: "1", label: "Suröl" },
  { id: "2", label: "Cider" },
  { id: "3", label: "Lager" },
  { id: "4", label: "Läsk" },
  { id: "5", label: "Ipa" },
  { id: "6", label: "Ale" },
];

const DRINK_TYPE_BY_ID = TYPES.reduce((acc, type) => {
  acc[type.id] = type;
  return acc;
}, {});

export const getDrinkTypeById = (id) => DRINK_TYPE_BY_ID[id] || null;

export const getDrinkTypeLabelById = (id) => getDrinkTypeById(id)?.label || "";