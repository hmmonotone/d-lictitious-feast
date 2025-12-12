import { Layout } from '@/components/layout';
import { Hero, FeaturedItems, QRLocation, Testimonials } from '@/components/home';
import { MenuSection } from '@/components/menu';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedItems />
      <MenuSection />
      <Testimonials />
      <QRLocation />
    </Layout>
  );
};

export default Index;
