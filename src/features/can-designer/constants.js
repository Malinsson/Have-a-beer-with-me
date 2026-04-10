
import textureBlommor from "../../assets/textures/Blommor.png";
import textureRodaTaxen from "../../assets/textures/RödaTaxen.png";
import textureIconBlommor from "../../assets/textures/icons/blommor.png";
import textureIconTax from "../../assets/textures/icons/tax.png";

 export const TEXTURES = [
  { id: "texture-1", label: "Blommor", src: textureBlommor, icon: textureIconBlommor },
  { id: "texture-2", label: "Röda taxen", src: textureRodaTaxen, icon: textureIconTax },
  { id: "texture-3", label: "Blommor", src: textureBlommor, icon: textureIconBlommor },
  { id: "texture-4", label: "Röda taxen", src: textureRodaTaxen, icon: textureIconTax },
];
 
export const COLORS = [
  { id: "color-1", label: "Red",   hex: "#E51236" },
  { id: "color-2", label: "Blue",  hex: "#001A52" },
  { id: "color-3", label: "Black", hex: "#121212" },
  { id: "color-4", label: "White", hex: "#ffffff" },
];

export const FONTS = [
  { id: "font-1", label: "Inter", style: "Inter, sans-serif", weight: 600, url: "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,600&display=swap" },
  { id: "font-2", label: "Bitcount single", style: "Bitcount Single, sans-serif", weight: 400, url: "https://fonts.googleapis.com/css2?family=Bitcount+Single&display=swap" },
  { id: "font-3", label: "Knewave", style: "Knewave, sans-serif", weight: 400, url: "https://fonts.googleapis.com/css2?family=Knewave&display=swap" },
  { id: "font-4", label: "Instrument serif", style: "Instrument Serif, serif", weight: 400, url: "https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap" },
];

FONTS.forEach(({ url }) => {
  if (!document.querySelector(`link[href="${url}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }
});

export const TEXT_ALIGNMENT = {
    top: "justify-start items-start",
    center: "justify-center items-center",
    bottom: "justify-end items-end",
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

const ALL_TAG_ITEMS = TAGS.flatMap(category => category.items);

const TAG_BY_ID = ALL_TAG_ITEMS.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

export const getTagLabelById = (id) => TAG_BY_ID[id]?.label || "";