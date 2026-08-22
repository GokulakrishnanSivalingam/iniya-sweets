// Iniya Sugar - Product Catalog
// Images are simple inline SVG placeholders (data URLs) so the project
// runs immediately without needing external image assets.
// Replace the `image` field with real product photography for production.

const whiteSugarSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <rect width="500" height="500" fill="#FBF3E3"/>
  <rect x="60" y="90" width="380" height="340" rx="18" fill="#FFFFFF" stroke="#173B3F" stroke-width="4"/>
  <rect x="60" y="90" width="380" height="90" rx="18" fill="#4D7C0F"/>
  <text x="250" y="145" font-family="Georgia, serif" font-size="34" fill="#FBF3E3" text-anchor="middle" font-weight="bold">இனியா</text>
  <text x="250" y="250" font-family="Georgia, serif" font-size="26" fill="#173B3F" text-anchor="middle">Pure White</text>
  <text x="250" y="285" font-family="Georgia, serif" font-size="26" fill="#173B3F" text-anchor="middle">Sugar</text>
  <circle cx="150" cy="360" r="5" fill="#E7DCC5"/>
  <circle cx="180" cy="380" r="5" fill="#E7DCC5"/>
  <circle cx="220" cy="355" r="5" fill="#E7DCC5"/>
  <circle cx="260" cy="385" r="5" fill="#E7DCC5"/>
  <circle cx="300" cy="360" r="5" fill="#E7DCC5"/>
  <circle cx="340" cy="380" r="5" fill="#E7DCC5"/>
</svg>`);

const brownSugarSVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <rect width="500" height="500" fill="#FBF3E3"/>
  <rect x="60" y="90" width="380" height="340" rx="18" fill="#FFF8EC" stroke="#173B3F" stroke-width="4"/>
  <rect x="60" y="90" width="380" height="90" rx="18" fill="#B45309"/>
  <text x="250" y="145" font-family="Georgia, serif" font-size="34" fill="#FBF3E3" text-anchor="middle" font-weight="bold">இனியா</text>
  <text x="250" y="250" font-family="Georgia, serif" font-size="26" fill="#173B3F" text-anchor="middle">Brown</text>
  <text x="250" y="285" font-family="Georgia, serif" font-size="26" fill="#173B3F" text-anchor="middle">Sugar</text>
  <circle cx="150" cy="360" r="5" fill="#8B5E34"/>
  <circle cx="180" cy="380" r="5" fill="#8B5E34"/>
  <circle cx="220" cy="355" r="5" fill="#8B5E34"/>
  <circle cx="260" cy="385" r="5" fill="#8B5E34"/>
  <circle cx="300" cy="360" r="5" fill="#8B5E34"/>
  <circle cx="340" cy="380" r="5" fill="#8B5E34"/>
</svg>`);

export const products = [
  {
    id: 1,
    name: "Pure White Sugar",
    tamilName: "தூய வெள்ளை சர்க்கரை",
    weight: "500g",
    weightLabel: "½ KG",
    price: 30,
    image: `data:image/svg+xml,${whiteSugarSVG}`,
    description:
      "Finely refined white sugar, carefully processed to bring natural sweetness to your everyday cooking and tea.",
  },
  {
    id: 2,
    name: "Pure White Sugar",
    tamilName: "தூய வெள்ளை சர்க்கரை",
    weight: "1kg",
    weightLabel: "1 KG",
    price: 55,
    image: `data:image/svg+xml,${whiteSugarSVG}`,
    description:
      "Finely refined white sugar, carefully processed to bring natural sweetness to your everyday cooking and tea.",
  },
  {
    id: 3,
    name: "Brown Sugar",
    tamilName: "பிரவுன் சர்க்கரை",
    weight: "500g",
    weightLabel: "½ KG",
    price: 75,
    image: `data:image/svg+xml,${brownSugarSVG}`,
    description:
      "Naturally rich brown sugar with a deep, earthy sweetness — perfect for traditional Tamil sweets and beverages.",
  },
  {
    id: 4,
    name: "Brown Sugar",
    tamilName: "பிரவுன் சர்க்கரை",
    weight: "1kg",
    weightLabel: "1 KG",
    price: 140,
    image: `data:image/svg+xml,${brownSugarSVG}`,
    description:
      "Naturally rich brown sugar with a deep, earthy sweetness — perfect for traditional Tamil sweets and beverages.",
  },
];

export default products;
