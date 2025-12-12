import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLocation = () => {
    document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm via-cream to-secondary" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="container-wide relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
            Authentic Bihari Cuisine
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 animate-slide-up">
            d'<span className="text-primary">LITTI</span>cious
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Where tradition meets taste. Experience the rich, aromatic flavors of Bihar 
            crafted with love and served with pride.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              onClick={scrollToMenu}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-warm hover:shadow-warm-lg transition-all"
            >
              View Menu
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={scrollToLocation}
              className="text-lg px-8 py-6 rounded-full border-2 border-primary/20 hover:bg-primary/5"
            >
              <MapPin className="mr-2 w-5 h-5" />
              Find Us
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-primary">12+</div>
              <div className="text-sm text-muted-foreground mt-1">Signature Dishes</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground mt-1">Authentic Recipes</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-primary">5★</div>
              <div className="text-sm text-muted-foreground mt-1">Customer Love</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
