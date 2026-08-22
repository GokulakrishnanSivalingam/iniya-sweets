import localProducts from "./products";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export function withProductImage(product) {
  const localImage = localProducts.find((item) => item.id === product.id)?.image;
  return {
    ...product,
    image: product.image?.startsWith("/")
      ? `${API_ORIGIN}${product.image}`
      : product.image || localImage || localProducts[0]?.image,
  };
}

export async function fetchCatalog() {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error("Unable to load products");
  const data = await response.json();
  return data.map(withProductImage);
}
