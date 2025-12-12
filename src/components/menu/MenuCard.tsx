import { MenuItem } from '@/types';
import { Flame, Leaf, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
  onClick: () => void;
}

export function MenuCard({ item, onClick }: MenuCardProps) {
  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${item.name}`}
      className={cn(
        'group bg-card rounded-2xl overflow-hidden shadow-sm border border-border',
        'cursor-pointer transition-all duration-300',
        'hover:shadow-warm-lg hover:-translate-y-1 hover:border-primary/20',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {item.isBestseller && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Bestseller
            </span>
          )}
          {item.isVeg ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
              <Leaf className="w-3 h-3 mr-1" />
              Veg
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
              Non-Veg
            </span>
          )}
        </div>

        {/* Spicy indicator */}
        {item.spicyLevel > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-0.5">
            {Array.from({ length: item.spicyLevel }).map((_, i) => (
              <Flame key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="font-semibold text-primary whitespace-nowrap">
            ₹{item.price}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
