import { Badge } from '@/components/ui/badge';
import type { ProductVar } from '../../backend';

interface VariantSelectorProps {
  variants: ProductVar[];
  selectedVariantId: string | null;
  onSelectVariant: (variantId: string) => void;
}

export default function VariantSelector({ variants, selectedVariantId, onSelectVariant }: VariantSelectorProps) {
  const colors = [...new Set(variants.map(v => v.variant.color).filter(Boolean))];
  const sizes = [...new Set(variants.map(v => v.variant.size).filter(Boolean))];

  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const variant = variants.find(v => v.variant.color === color);
              const isSelected = variant?.id === selectedVariantId;
              return (
                <Badge
                  key={color}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => variant && onSelectVariant(variant.id)}
                >
                  {color}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = variants.find(v => v.variant.size === size);
              const isSelected = variant?.id === selectedVariantId;
              return (
                <Badge
                  key={size}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => variant && onSelectVariant(variant.id)}
                >
                  {size}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
