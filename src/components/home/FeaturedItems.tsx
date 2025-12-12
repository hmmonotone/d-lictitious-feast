import { useState } from 'react';
import { MenuItem } from '@/types';
import { getFeaturedItems } from '@/lib/data';
import { MenuCard } from '@/components/menu/MenuCard';
import { MenuModal } from '@/components/menu/MenuModal';

export function FeaturedItems() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const featuredItems = getFeaturedItems();

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-medium mb-2 block">Chef's Selection</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Bestsellers
          </h2>
          <p className="text-muted-foreground text-lg">
            These dishes have won the hearts of our guests. Try them and discover 
            why they keep coming back for more.
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MenuCard
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            </div>
          ))}
        </div>

        {/* Modal */}
        <MenuModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </div>
    </section>
  );
}
