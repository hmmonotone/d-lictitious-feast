import { Layout } from '@/components/layout';
import { Heart, Leaf, Shield, Award } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Made with Love', description: 'Every dish is prepared with passion and care, just like home cooking.' },
  { icon: Leaf, title: 'Fresh Ingredients', description: 'We source the freshest local ingredients and authentic spices from Bihar.' },
  { icon: Shield, title: 'Hygiene First', description: 'Our kitchen follows the highest standards of cleanliness and food safety.' },
  { icon: Award, title: 'Authentic Recipes', description: 'Traditional recipes passed down through generations of Bihari families.' },
];

const About = () => {
  return (
    <Layout>
      <section className="pt-32 pb-16 bg-warm">
        <div className="container-narrow text-center">
          <span className="text-primary font-medium mb-2 block">Our Story</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
            About d'<span className="text-primary">LITTI</span>cious
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A labor of love dedicated to bringing the authentic, soul-satisfying flavors 
            of Bihar to your table.
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow">
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-xl leading-relaxed mb-8">
              d'LITTIcious was born from a simple dream: to share the incredible culinary 
              heritage of Bihar with the world. Growing up in Bihar, every meal was a 
              celebration—the smoky aroma of litti roasting over coal, the tangy punch 
              of chokha, the comforting warmth of sattu paratha on cold mornings.
            </p>
            <p className="leading-relaxed mb-8">
              We realized that while Indian cuisine is celebrated globally, Bihari food 
              remained largely unexplored. This drove us to create a space where these 
              incredible flavors could shine. Every recipe at d'LITTIcious has been 
              carefully sourced from traditional homes across Bihar, tested, and perfected 
              to bring you the most authentic experience possible.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-warm">
        <div className="container-wide">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
