import { usePageMeta } from '../hooks/usePageMeta';
import FeaturedCategories from '../components/catalog/FeaturedCategories';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function HomePage() {
  usePageMeta('Home', 'Shop premium clothing, beauty, wellness, fragrances, jewellery, and lifestyle products');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[700px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1920x700.png"
          alt="Premium Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
          <div className="container pb-12 md:pb-20">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 max-w-2xl">
              Discover Premium Quality
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-xl">
              Explore our curated collection of fashion, beauty, wellness, and lifestyle products
            </p>
            <Button size="lg" onClick={() => navigate({ to: '/category/$categoryId', params: { categoryId: '1' } })}>
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-8 bg-accent/20">
        <div className="container">
          <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden">
            <img
              src="/assets/generated/promo-banner.dim_1920x500.png"
              alt="Special Offers"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent flex items-center">
              <div className="container">
                <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                  Special Offers
                </h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-md">
                  Don't miss out on our exclusive deals and seasonal collections
                </p>
                <Button variant="outline" size="lg">
                  View Offers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our carefully curated categories to find exactly what you're looking for
            </p>
          </div>
          <FeaturedCategories />
        </div>
      </section>
    </div>
  );
}
