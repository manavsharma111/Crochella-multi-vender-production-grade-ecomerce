import { useState, useEffect, useRef, Suspense } from "react"

const LazySection = ({
  children,
  fallback = null,
  rootMargin = "800px 0px",
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    // If IntersectionObserver is not supported, just render the content immediately
    if (!window.IntersectionObserver) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once it becomes visible, stop observing
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current)
          }
        }
      },
      { rootMargin }, // Load when it's within rootMargin (e.g., 800px away)
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [rootMargin])

  return (
    <div ref={sectionRef} className="lazy-section-wrapper min-h-[50vh]">
      {isVisible ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  )
}

export default LazySection
