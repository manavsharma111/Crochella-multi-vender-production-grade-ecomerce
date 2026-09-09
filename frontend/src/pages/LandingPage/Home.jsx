import React, { useEffect, Suspense, lazy } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import CinematicHero from "./sections/CinematicHero"
import TextRevealPhilosophy from "./sections/TextRevealPhilosophy"
import FeaturedCollections from "./sections/FeaturedCollections"
import ColorMorphSection from "../../components/common/animation/ColorMorphSection"
import Footer from "./sections/Footer"

const HorizontalLookbook = lazy(() => import("./sections/HorizontalLookbook"))
const VideoScaleTransition = lazy(() => import("./sections/VideoScaleTransition"))
const TextMarqueeSeparator = lazy(() => import("./sections/TextMarqueeSeparator"))
const StackedFabricCards = lazy(() => import("./sections/StackedFabricCards"))
const FullscreenCollection = lazy(() => import("./sections/FullscreenCollection"))
const ArtisansAccordion = lazy(() => import("./sections/ArtisansAccordion"))
const HandloomHistoryTimeline = lazy(() => import("./sections/HandloomHistoryTimeline"))
const InteractiveFabric3D = lazy(() => import("./sections/InteractiveFabric3D"))
const EyesFollow = lazy(() => import("./sections/EyesFollow"))
const ArtisanCraftsmanship = lazy(() => import("./sections/ArtisanCraftsmanship"))
const BrandStory = lazy(() => import("./sections/BrandStory"))
const FabricShowcase = lazy(() => import("./sections/FabricShowcase"))
const ProcessTimeline = lazy(() => import("./sections/ProcessTimeline"))
const TextMaskPhilosophy = lazy(() => import("./sections/TextMaskPhilosophy"))
const MarqueeText = lazy(() => import("./sections/MarqueeText"))

gsap.registerPlugin(ScrollTrigger)

const Home = ({ loading }) => {
  useEffect(() => {
    window.scrollTo(0, 0)

    // Refresh ScrollTrigger to recalculate all trigger positions
    // This is crucial because images and dynamic content might shift the DOM height
    const timeout1 = setTimeout(() => ScrollTrigger.refresh(), 500)
    const timeout2 = setTimeout(() => ScrollTrigger.refresh(), 2000)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
    }
  }, [loading])

  return (
    <div className="w-full bg-black min-h-screen text-white cursor-none">
      <CinematicHero loading={loading} />
      <TextRevealPhilosophy />
      <FeaturedCollections />
      <Suspense fallback={<div className="min-h-[50vh] w-full bg-black flex items-center justify-center text-white/50">Loading sections...</div>}>
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
        <TextMaskPhilosophy />
        <MarqueeText />
        <EyesFollow />
      </Suspense>
      {/* <Newsletter /> */}

      {/* Premium Dark Footer */}
      <Footer />
    </div>
  )
}

export default Home
