import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { fetchCatalog } from "../data/catalog";
import ProductCard from "../components/ProductCard";

const LOADING_QUOTES = [
  "Sweetening every batch with care — Iniya Sugar.",
  "எங்கள் இனிமை, உங்கள் நம்பிக்கை — Iniya Sugar.",
  "From farm to kitchen, purity you can taste.",
];

export default function Products() {
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [filters, setFilters] = useState({ search: "", type: "all", weight: "all", sort: "default" });

  useEffect(() => {
    document.title = "Products | Iniya Sugar";
    setIsLoading(true);

    let cancelled = false;

    const tryFetch = () => {
      fetchCatalog()
        .then((items) => {
          if (cancelled) return;
          if (!items || items.length === 0) {
            // backend returned empty — keep retrying
            setTimeout(tryFetch, 3000);
            return;
          }
          setCatalog(items);
          setIsLoading(false); // success — stop the loader
        })
        .catch(() => {
          if (cancelled) return;
          // backend not ready yet — wait a bit and try again
          setTimeout(tryFetch, 3000);
        });
    };

    tryFetch();

    return () => {
      cancelled = true; // stop retrying if component unmounts
    };
  }, []);

  // Rotate the loading quote every few seconds while loading
  useEffect(() => {
    if (!isLoading) return;
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [isLoading]);

  const types = [...new Set(catalog.map((product) => product.name))];
  const weights = [...new Set(catalog.map((product) => product.weightLabel || product.weight))];
  const visibleProducts = catalog
    .filter((product) => {
      const search = filters.search.trim().toLowerCase();
      const matchesSearch = !search || `${product.name} ${product.tamilName || ""} ${product.weightLabel || ""}`.toLowerCase().includes(search);
      const matchesType = filters.type === "all" || product.name === filters.type;
      const matchesWeight = filters.weight === "all" || (product.weightLabel || product.weight) === filters.weight;
      return matchesSearch && matchesType && matchesWeight;
    })
    .sort((first, second) => filters.sort === "low" ? first.price - second.price : filters.sort === "high" ? second.price - first.price : 0);

  const clearFilters = () => setFilters({ search: "", type: "all", weight: "all", sort: "default" });

  return (
    <section className="section products-page">
      <div className="container">
        <div className="products-intro">
          <div>
            <p className="section-eyebrow">எங்கள் தயாரிப்புகள்</p>
            <h1 className="section-title-lg">Our Products</h1>
            <p className="section-subtitle">
              Pure, quality sugar in sizes made for every kitchen.
            </p>
          </div>
          <div className="products-mark" aria-hidden="true">✦</div>
        </div>

        {isLoading ? (
          <div className="products-loader" role="status" aria-live="polite">
            <div className="products-loader-spinner" aria-hidden="true" />
            <p className="products-loader-quote">{LOADING_QUOTES[quoteIndex]}</p>
          </div>
        ) : (
          <>
            <div className="product-filters" aria-label="Product filters">
              <label className="filter-search"><FiSearch aria-hidden="true" /><span className="sr-only">Search products</span><input type="search" placeholder="Search products" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></label>
              <label><span className="sr-only">Sugar type</span><select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}><option value="all">All types</option>{types.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
              <label><span className="sr-only">Weight</span><select value={filters.weight} onChange={(event) => setFilters({ ...filters, weight: event.target.value })}><option value="all">All weights</option>{weights.map((weight) => <option key={weight} value={weight}>{weight}</option>)}</select></label>
              <label><span className="sr-only">Sort products</span><select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}><option value="default">Sort: Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option></select></label>
              {(filters.search || filters.type !== "all" || filters.weight !== "all" || filters.sort !== "default") && <button type="button" className="filter-clear" onClick={clearFilters}><FiX /> Clear</button>}
            </div>
            <p className="filter-results">Showing {visibleProducts.length} of {catalog.length} products</p>

            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {catalog.length > 0 && visibleProducts.length === 0 && <p className="filter-empty">No products match these filters.</p>}
          </>
        )}
      </div>
    </section>
  );
}