import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Preload all lazy routes after the browser is idle.
 * This makes subsequent navigations instant because chunks
 * are already downloaded in the background.
 */
@Injectable({ providedIn: 'root' })
export class IdlePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.data && 'preload' in route.data && route.data['preload'] === false) {
      return of(null);
    }

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(
        () => {
          load().subscribe();
        },
        { timeout: 15000 },
      );
    } else {
      setTimeout(() => load().subscribe(), 2000);
    }

    return of(null);
  }
}
