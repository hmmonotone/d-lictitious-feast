import { useState } from 'react';
import { Layout } from '@/components/layout';
import { QRLocation } from '@/components/home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MessageCircle, Instagram, MapPin, Clock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message sent!', description: "We'll get back to you soon." });
    setFormData({ name: '', contact: '', message: '' });
  };

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-warm">
        <div className="container-narrow text-center">
          <span className="text-primary font-medium mb-2 block">Get in Touch</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground">We'd love to hear from you!</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="font-display text-2xl font-bold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone / Email</label>
                  <Input value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} required />
                </div>
                <Button type="submit" className="w-full bg-primary">Send Message</Button>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground">123 Food Street, Flavor Town, City 123456</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Hours</h3>
                  <p className="text-muted-foreground">Mon-Fri: 11AM-10PM | Sat-Sun: 9AM-11PM</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://instagram.com/dlitticious" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4 mr-2" /> Instagram
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QRLocation />
    </Layout>
  );
};

export default Contact;
