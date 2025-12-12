import { useState } from 'react';
import { MenuItem } from '@/types';
import { getMenuItems } from '@/lib/data';
import { MenuCard } from './MenuCard';
import { MenuModal } from './MenuModal';

export function MenuSection() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const menuItems = getMenuItems();

  return (
    <section id="menu" className="section-padding bg-warm">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium mb-2 block">Our Menu</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Taste of Bihar
          </h2>
          <p className="text-muted-foreground text-lg">
            Each dish is a celebration of authentic Bihari flavors, prepared with traditional 
            recipes passed down through generations.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
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
