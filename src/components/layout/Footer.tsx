import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';
const socialLinks = [{
  icon: Instagram,
  href: 'https://instagram.com/dlitticious',
  label: 'Instagram'
}];
const quickLinks = [{
  href: '/',
  label: 'Home'
}, {
  href: '/about',
  label: 'About Us'
}, {
  href: '/#menu',
  label: 'Menu'
}, {
  href: '/blog',
  label: 'Blog'
}, {
  href: '/contact',
  label: 'Contact'
}];
export function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-foreground text-background">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-bold mb-4">
              d'<span className="text-accent">LITTI</span>cious
            </h3>
            <p className="text-background/70 mb-6 leading-relaxed">
              Bringing the authentic flavors of Bihar to your table. Every dish tells a story of tradition, 
              passion, and the rich culinary heritage of our land.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors" aria-label={social.label}>
                  <social.icon className="w-5 h-5" />
                </a>)}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => <li key={link.href}>
                  <Link to={link.href} className="text-background/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-background/70">Shop No. 10 & 11, First Floor, SMS Building, 84/1, Opposite Sobha Mayflower, Green Glen Layout, Bengaluru, Karnataka 560103
                <br />
                  City, State 123456
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+919999999999" className="text-background/70 hover:text-accent transition-colors">+91 74114-31903</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="mailto:hello@dlitticious.com" className="text-background/70 hover:text-accent transition-colors">contact@dlitticious.com</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-background/70">
              <li className="flex justify-between">
                <span>Monday - Thursday</span>
                <span>12 PM - 11 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Friday - Sunday</span>
                <span>12 PM - 11:30 PM</span>
              </li>
              <li className="pt-2 text-accent font-medium">Closed on Every First Monday of the Month</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm">
              © {currentYear} d'LITTIcious. All rights reserved.
            </p>
            <p className="text-background/60 text-sm">
              Made with ❤️ for Bihar
            </p>
          </div>
        </div>
      </div>
    </footer>;
}