/**
 * initSlider — initialises a scroll-snap slider within `container`.
 *
 * Expects inside the container:
 *   [data-track]  — the scrollable UL/OL
 *   [data-prev]   — previous button
 *   [data-next]   — next button
 *
 * @param infinite  Clone first/last slides for seamless looping (default: false).
 *                  When false, buttons are disabled at the boundaries instead.
 */
export function initSlider(
  container: HTMLElement,
  { infinite = false }: { infinite?: boolean } = {}
) {
  const track = container.querySelector<HTMLElement>("[data-track]");
  if (!track) return;

  const prevBtn = container.querySelector<HTMLButtonElement>("[data-prev]");
  const nextBtn = container.querySelector<HTMLButtonElement>("[data-next]");
  let timer: ReturnType<typeof setTimeout>;

  if (infinite) {
    const realSlides = Array.from(track.children) as HTMLElement[];
    const total = realSlides.length;

    // Read width before DOM mutations to avoid forced reflow
    let trackWidth = track.offsetWidth;
    new ResizeObserver(() => { trackWidth = track.offsetWidth; }).observe(track);
    const w = () => trackWidth;

    // Prepend clone of last slide, append clone of first slide
    track.appendChild(realSlides[0].cloneNode(true));
    track.insertBefore(realSlides[total - 1].cloneNode(true), realSlides[0]);

    let current = 1;
    track.scrollLeft = trackWidth;

    const goTo = (index: number, smooth = true) => {
      current = index;
      track.scrollTo({ left: current * w(), behavior: smooth ? "smooth" : "instant" });
    };

    track.addEventListener("scroll", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const idx = Math.round(track.scrollLeft / w());
        if (idx === 0) goTo(total, false);         // landed on last-clone → jump to last real
        else if (idx === total + 1) goTo(1, false); // landed on first-clone → jump to first real
        else current = idx;
      }, 80);
    });

    prevBtn?.addEventListener("click", () => goTo(current - 1));
    nextBtn?.addEventListener("click", () => goTo(current + 1));
  } else {
    const total = track.children.length;
    let current = 0;
    let trackWidth = 0;
    const w = () => trackWidth || (trackWidth = track.offsetWidth);
    new ResizeObserver(() => { trackWidth = 0; }).observe(track);

    const goTo = (n: number, smooth = true) => {
      current = Math.max(0, Math.min(n, total - 1));
      track.scrollTo({ left: current * w(), behavior: smooth ? "smooth" : "instant" });
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === total - 1;
    };

    track.addEventListener("scroll", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        current = Math.round(track.scrollLeft / w());
      }, 80);
    });

    prevBtn?.addEventListener("click", () => goTo(current - 1));
    nextBtn?.addEventListener("click", () => goTo(current + 1));

    // Set initial button states without reading offsetWidth
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = total <= 1;
  }
}
