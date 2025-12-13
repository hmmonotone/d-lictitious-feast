import { useEffect, useRef } from 'react';
import { Phone, MessageCircle, Flame, Leaf, Star, Egg } from 'lucide-react';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface MenuModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MenuModal({ item, isOpen, onClose }: MenuModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!item) return null;

  const whatsappLink = `https://wa.me/919999999999?text=Hi!%20I%20would%20like%20to%20order%20${encodeURIComponent(item.name)}`;
  const isVeg = item.foodType === 'veg';
  const isEgg = item.foodType === 'egg';
  const isNonVeg = item.foodType === 'non-veg';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 bg-tile">
        {/* Content */}
        <div className="p-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.isBestseller && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tag-bestseller text-tile-title text-sm font-medium">
                <Star className="w-4 h-4 mr-1.5 fill-current" />
                Bestseller
              </span>
            )}
            {isVeg && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tag-veg text-white text-sm font-medium">
                <Leaf className="w-4 h-4 mr-1.5" />
                Vegetarian
              </span>
            )}
            {isEgg && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tag-egg text-white text-sm font-medium">
                <Egg className="w-4 h-4 mr-1.5" />
                Contains Egg
              </span>
            )}
            {isNonVeg && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-tag-nonveg text-white text-sm font-medium">
                Non-Vegetarian
              </span>
            )}
          </div>

          <DialogHeader className="mb-4 text-left">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="font-display text-2xl md:text-3xl font-bold text-tile-title">
                {item.name}
              </DialogTitle>
              {item.salesPrice > 0 && (
                <span className="text-2xl font-bold text-tile-price whitespace-nowrap">
                  ₹{item.salesPrice}
                </span>
              )}
            </div>
            <DialogDescription className="text-base text-tile-desc mt-2">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          {/* Category badge */}
          <div className="mb-6">
            <span className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground capitalize">
              {item.category.replace('-', ' ')}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 bg-tag-veg hover:bg-tag-veg/90 text-white">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Order via WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-tile-border text-tile-title hover:bg-tile-hover">
              <a href="tel:+919999999999">
                <Phone className="w-4 h-4 mr-2" />
                Call to Order
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
