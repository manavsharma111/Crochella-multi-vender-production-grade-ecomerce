import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CinematicHero from './sections/CinematicHero';
import TextRevealPhilosophy from './sections/TextRevealPhilosophy';
import HorizontalLookbook from './sections/HorizontalLookbook';
import VideoScaleTransition from './sections/VideoScaleTransition';
import TextMarqueeSeparator from './sections/TextMarqueeSeparator';
import StackedFabricCards from './sections/StackedFabricCards';
import FullscreenCollection from './sections/FullscreenCollection';
import ArtisansAccordion from './sections/ArtisansAccordion';
import HandloomHistoryTimeline from './sections/HandloomHistoryTimeline';
import InteractiveFabric3D from './sections/InteractiveFabric3D';
import EyesFollow from './sections/EyesFollow';
import HandloomBackground from '../../components/common/HandloomBackground';
import FeaturedCollections from './sections/FeaturedCollections';
import Newsletter from './sections/Newsletter';
import ArtisanCraftsmanship from './sections/ArtisanCraftsmanship';
import BrandStory from './sections/BrandStory';
import FabricShowcase from './sections/FabricShowcase';
import ProcessTimeline from './sections/ProcessTimeline';
import TextMaskPhilosophy from './sections/TextMaskPhilosophy';
import MarqueeText from './sections/MarqueeText';
import ColorMorphSection from '../../components/common/animation/ColorMorphSection';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

const Home = ({ loading }) => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Refresh ScrollTrigger to recalculate all trigger positions
    // This is crucial because images and dynamic content might shift the DOM height
    const timeout1 = setTimeout(() => ScrollTrigger.refresh(), 500);
    const timeout2 = setTimeout(() => ScrollTrigger.refresh(), 2000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [loading]);

  return (
    <div className="w-full bg-black min-h-screen text-white cursor-none">
      <CinematicHero loading={loading} />
      <TextRevealPhilosophy />
      <FeaturedCollections />
      <BrandStory />
      <ArtisanCraftsmanship />
      <HorizontalLookbook />
      <ColorMorphSection color="#2a0013">
        <FabricShowcase />
      </ColorMorphSection>
      <ProcessTimeline />
      <VideoScaleTransition />
      <TextMarqueeSeparator />
      <StackedFabricCards />
      <FullscreenCollection />
      <ArtisansAccordion />
      <HandloomHistoryTimeline />
      <InteractiveFabric3D />
      {/*  */}
      <TextMaskPhilosophy />
      {/*  */}
      <MarqueeText />
      <EyesFollow />
      {/* <Newsletter /> */}

      {/* Premium Dark Footer */}
    <Footer />
    </div>
  );
};

export default Home;