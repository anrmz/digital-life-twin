import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

/**
 * Subtle pointer-following glow for hero / showcase surfaces.
 * The directive exposes `--glow-x` / `--glow-y` CSS variables on its host;
 * a descendant overlay can read them via a radial-gradient.
 */
@Directive({
  selector: '[appMouseGlow]',
})
export class MouseGlow {
  readonly strength = input(1, { alias: 'appMouseGlowStrength' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private get finePointer(): boolean {
    return !window.matchMedia('(pointer: coarse)').matches;
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.finePointer) {
      return;
    }
    const rect = this.host.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.host.nativeElement.style.setProperty('--glow-x', `${x}px`);
    this.host.nativeElement.style.setProperty('--glow-y', `${y}px`);
  }

  @HostListener('pointerleave')
  onPointerLeave(): void {
    const el = this.host.nativeElement;
    el.style.setProperty('--glow-x', '50%');
    el.style.setProperty('--glow-y', '50%');
  }
}
