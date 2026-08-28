import React, { useEffect, useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { HeroSection } from '../components/landing/HeroSection';
import { HoursBanner } from '../components/landing/HoursBanner';
import { MenuSection } from '../components/landing/MenuSection';
import { StorySection } from '../components/landing/StorySection';
import { ReviewsSection } from '../components/landing/ReviewsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { LocationCard } from '../components/landing/LocationCard';
import { ChatWidget } from '../components/chat/ChatWidget';
import { Footer } from '../components/common/Footer';
import { ArrowLeft, Store } from 'lucide-react';

interface BusinessStorefrontProps {
  slug: string;
  navigate: (route: string) => void;
}

export const BusinessStorefront: React.FC<BusinessStorefrontProps> = ({ slug, navigate }) => {
  const { loadBusinessBySlug, businessData } = useBusiness();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const ok = await loadBusinessBySlug(slug);
      setFound(ok);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (slug) init();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif font-bold text-artisan-900 text-lg">Loading {slug} Storefront...</p>
        </div>
      </div>
    );
  }

  if (!found) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="card-artisan p-8 max-w-md text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-artisan-950">Storefront Not Found</h2>
          <p className="text-xs text-artisan-600">
            We could not find a business registered under <code>/b/{slug}</code>.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Canvo Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <HeroSection />
      <HoursBanner />
      <MenuSection />
      <StorySection />
      <ReviewsSection />
      <FaqSection />
      <LocationCard />
      <Footer />
      <ChatWidget />
    </div>
  );
};
