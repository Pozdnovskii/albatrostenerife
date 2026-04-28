/**
 * initSlider — initialises a scroll-snap slider within `container`.
 *
 * Expects inside the container:
 *   [data-track]  — the scrollable UL/OL
 *   [data-prev]   — previous button
 *   [data-next]   — next button
 */
export function initSlider(container: HTMLElement) {
  const track = container.querySelector<HTMLElement>("[data-track]");
  if (!track) return;

  const prevBtn = container.querySelector<HTMLButtonElement>("[data-prev]");
  const nextBtn = container.querySelector<HTMLButtonElement>("[data-next]");
  const total = track.children.length;
  let current = 0;
  let trackWidth = 0;
  let timer: ReturnType<typeof setTimeout>;

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

  if (prevBtn) prevBtn.disabled = true;
  if (nextBtn) nextBtn.disabled = total <= 1;
}
