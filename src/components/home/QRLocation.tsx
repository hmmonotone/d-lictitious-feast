import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QRLocation() {
  const googleMapsLink = 'https://maps.google.com/?q=d%27LITTIcious+Restaurant';

  return (
    <section id="location" className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container-narrow">
        <div className="bg-card rounded-3xl shadow-warm-lg border border-border overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* QR Code Side */}
            <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/5 to-transparent">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Find Us Easily
                </h3>
                <p className="text-muted-foreground">
                  Scan the QR code to open our location in Google Maps
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
                <img
                  src="/qr-location.png"
                  alt="Scan to open restaurant location in Google Maps"
                  className="w-48 h-48 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>

              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </a>
              </Button>
            </div>

            {/* Address Side */}
            <div className="p-8 md:p-12 flex flex-col justify-center bg-foreground text-background">
              <h4 className="font-display text-xl font-semibold mb-6 text-background/90">
                Visit Us Today
              </h4>

              <div className="space-y-6">
                <div>
                  <h5 className="font-medium text-accent mb-2">Address</h5>
                  <p className="text-background/80 leading-relaxed">
                    123 Food Street, Flavor Town<br />
                    Near City Center Mall<br />
                    City, State 123456
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-accent mb-2">Opening Hours</h5>
                  <div className="text-background/80 space-y-1">
                    <p>Monday - Friday: 11 AM - 10 PM</p>
                    <p>Saturday - Sunday: 9 AM - 11 PM</p>
                    <p className="text-accent font-medium">Weekend Brunch: 9 AM - 12 PM</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-accent mb-2">Contact</h5>
                  <p className="text-background/80">
                    Phone: <a href="tel:+919999999999" className="hover:text-accent transition-colors">+91 99999 99999</a><br />
                    Email: <a href="mailto:hello@dlitticious.com" className="hover:text-accent transition-colors">hello@dlitticious.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
