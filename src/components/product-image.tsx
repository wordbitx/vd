import type { Product } from "@/lib/site";

const positions = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"] as const;

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <div
      className={`product-image ${className}`}
      role="img"
      aria-label={`Illustrative product photograph for ${product.name}`}
      style={{ backgroundImage: `url(${product.sheet})`, backgroundPosition: positions[product.quadrant] }}
    />
  );
}
