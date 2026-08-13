import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import gsap from 'gsap';

/**
 * Scroll-triggered reveal using GSAP + IntersectionObserver.
 * Apply on a section/card to reveal it on scroll; pass `revealStagger`
 * (a CSS selector) to stagger its direct children instead.
 */
@Directive({
  selector: '[appReveal]',
})
export class Reveal implements AfterViewInit {
  readonly stagger = input<string | null>(null, { alias: 'revealStagger' });
  readonly delay = input(0, { alias: 'revealDelay' });
  readonly distance = input(24, { alias: 'revealDistance' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const selector = this.stagger();
    const targets: HTMLElement[] = selector
      ? Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>(selector))
      : [this.host.nativeElement];
    if (!targets.length) {
      return;
    }

    // Content is never opacity-hidden: it stays fully readable at all times
    // (including fast scroll and page captures). Elements that start below the
    // fold get a subtle slide-up as the user scrolls, via transform only.
    const top = this.host.nativeElement.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.9) {
      return;
    }

    gsap.set(targets, { y: this.distance() });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          observer.disconnect();
          gsap.to(targets, {
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            stagger: selector ? 0.08 : 0,
            delay: this.delay() / 1000,
            clearProps: 'transform',
          });
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
