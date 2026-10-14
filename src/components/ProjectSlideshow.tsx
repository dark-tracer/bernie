import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectSlideshow({ images, title, compact = false }: { images: string[]; title: string; compact?: boolean }) {
  const [viewport, carousel] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const update = useCallback(() => setSelected(carousel?.selectedScrollSnap() ?? 0), [carousel]);
  useEffect(() => {
    if (!carousel) return;
    update();
    carousel.on("select", update).on("reInit", update);
    return () => { carousel.off("select", update).off("reInit", update); };
  }, [carousel, update]);
  if (!images.length) return <div className="h-full w-full bg-surface-container-high" />;
  return (
    <section aria-label={`${title} images`} aria-roledescription="carousel" className="relative h-full w-full overflow-hidden bg-surface-container-low rounded-lg">
      <div ref={viewport} className="h-full overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {images.map((image, index) => (
            <div key={image} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${images.length}`} className="h-full min-w-0 flex-[0_0_100%]">
              <img src={image} alt={`${title} — image ${index + 1}`} loading={index === 0 && !compact ? "eager" : "lazy"} className={`h-full w-full ${compact ? "object-cover" : "object-contain"}`} />
            </div>
          ))}
        </div>
      </div>
      {images.length > 1 && <>
        <Button type="button" variant="outline" size="icon" aria-label="Previous image" title="Previous image" onClick={() => carousel?.scrollPrev()} className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/90 text-on-surface border-outline-variant"><ChevronLeft /></Button>
        <Button type="button" variant="outline" size="icon" aria-label="Next image" title="Next image" onClick={() => carousel?.scrollNext()} className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/90 text-on-surface border-outline-variant"><ChevronRight /></Button>
        <div aria-live="polite" aria-atomic="true" className="absolute bottom-3 right-3 rounded-md bg-background/90 px-3 py-1 text-sm text-on-surface">{selected + 1} / {images.length}</div>
      </>}
    </section>
  );
}