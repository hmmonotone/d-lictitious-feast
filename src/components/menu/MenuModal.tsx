import { useEffect, useRef } from 'react';
import { X, Phone, MessageCircle, Flame, Leaf, Star } from 'lucide-react';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          
          {/* Badges overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {item.isBestseller && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <Star className="w-4 h-4 mr-1.5 fill-current" />
                Bestseller
              </span>
            )}
            {item.isVeg ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500 text-white text-sm font-medium">
                <Leaf className="w-4 h-4 mr-1.5" />
                Vegetarian
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-medium">
                Non-Vegetarian
              </span>
            )}
          </div>

          {/* Spicy level */}
          {item.spicyLevel > 0 && (
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {Array.from({ length: item.spicyLevel }).map((_, i) => (
                <Flame key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
              ))}
              <span className="text-sm font-medium ml-1">Spicy</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {item.name}
              </DialogTitle>
              <span className="text-2xl font-bold text-primary whitespace-nowrap">
                ₹{item.price}
              </span>
            </div>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              {item.description}
            </DialogDescription>
          </DialogHeader>

          {/* Long description */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-2">About this dish</h4>
            <p className="text-muted-foreground leading-relaxed">
              {item.longDescription}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Order via WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
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
