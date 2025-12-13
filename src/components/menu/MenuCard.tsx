import { MenuItem } from '@/types';
import { Flame, Leaf, Star, Egg } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
  onClick: () => void;
}

export function MenuCard({ item, onClick }: MenuCardProps) {
  const isVeg = item.foodType === 'veg';
  const isEgg = item.foodType === 'egg';
  const isNonVeg = item.foodType === 'non-veg';

  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${item.name}`}
      className={cn(
        'group bg-tile rounded-2xl overflow-hidden border-b-[3px] border-tile-border/40',
        'cursor-pointer transition-all duration-300',
        'hover:bg-tile-hover hover:scale-[1.02] hover:shadow-warm-lg',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      )}
    >
      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {item.isBestseller && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tag-bestseller text-tile-title text-xs font-medium">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Bestseller
              </span>
            )}
            {isVeg && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tag-veg text-white text-xs font-medium">
                <Leaf className="w-3 h-3 mr-1" />
                Veg
              </span>
            )}
            {isEgg && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tag-egg text-white text-xs font-medium">
                <Egg className="w-3 h-3 mr-1" />
                Egg
              </span>
            )}
            {isNonVeg && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-tag-nonveg text-white text-xs font-medium">
                Non-Veg
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-tile-title group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          {item.salesPrice > 0 && (
            <span className="font-semibold text-tile-price whitespace-nowrap">
              ₹{item.salesPrice}
            </span>
          )}
          {item.salesPrice === 0 && item.isPackagedGood && (
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              MRP
            </span>
          )}
        </div>
        
        <p className="text-sm text-tile-desc line-clamp-2">
          {item.description}
        </p>
      </div>
    </article>
  );
}
