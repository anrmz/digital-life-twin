import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';

/**
 * Very subtle magnetic pull toward the pointer. Only active on fine pointers
 * with motion enabled. Keep the strength low for a premium feel.
 * GSAP is dynamically imported only on capable devices.
 */
@Directive({
  selector: '[appMagnetic]',
  host: {
    '(pointermove)': 'onPointerMove($event)',
    '(pointerleave)': 'onPointerLeave()',
  },
})
export class Magnetic implements AfterViewInit, OnDestroy {
  /** Movement strength in percent of the distance to the center (0.15 = 15%). */
  readonly strength = input(0.15, { alias: 'appMagneticStrength' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private gsap: typeof import('gsap')['default'] | null = null;
  private xTo: ((value: number) => void) | null = null;
  private yTo: ((value: number) => void) | null = null;
  private enabled = false;

  ngAfterViewInit(): void {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    import('gsap').then((gsapModule) => {
      this.gsap = gsapModule.default;
      this.enabled = true;
      this.xTo = this.gsap.quickTo(this.host.nativeElement, 'x', {
        duration: 0.4,
        ease: 'power3.out',
      });
      this.yTo = this.gsap.quickTo(this.host.nativeElement, 'y', {
        duration: 0.4,
        ease: 'power3.out',
      });
    });
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.enabled) {
      return;
    }
    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    this.xTo?.(relX * this.strength());
    this.yTo?.(relY * this.strength());
  }

  onPointerLeave(): void {
    if (!this.enabled) {
      return;
    }
    this.xTo?.(0);
    this.yTo?.(0);
  }

  ngOnDestroy(): void {
    if (this.gsap) {
      this.gsap.killTweensOf(this.host.nativeElement);
    }
  }
}
