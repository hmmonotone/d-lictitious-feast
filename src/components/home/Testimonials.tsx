import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/types';

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ananya Sharma',
    text: "The Litti Chokha here transported me straight to my grandmother's kitchen in Patna. Authentic, delicious, and made with so much love. This is the real deal!",
    rating: 5,
  },
  {
    id: '2',
    name: 'Rahul Verma',
    text: 'Finally, a place that does justice to Bihari cuisine! The mutton curry is out of this world, and the sattu paratha is exactly how my mother makes it.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Priya Gupta',
    text: "I've tried many restaurants claiming to serve Bihari food, but d'LITTIcious is the only one that gets it right. The flavors, the presentation, everything is perfect.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium mb-2 block">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Here's what our happy customers have to say 
            about their experience at d'LITTIcious.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border relative animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Quote className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4 pt-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
