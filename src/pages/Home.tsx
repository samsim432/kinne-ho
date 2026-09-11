import React from 'react';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { CategorySection } from '../components/home/CategorySection';
import { NearYouSection } from '../components/home/NearYouSection';
import { TrustSection } from '../components/home/TrustSection';

export const Home: React.FC = () => {
  return (
    <div className="space-y-12 py-2">
      <HeroSlideshow />
      <CategorySection />
      <NearYouSection />
      <TrustSection />
    </div>
  );
};