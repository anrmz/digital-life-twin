import { Injectable, signal, computed, type Signal } from '@angular/core';

import { FR_TRANSLATIONS } from '../i18n/fr';
import { EN_TRANSLATIONS } from '../i18n/en';
import { AR_TRANSLATIONS } from '../i18n/ar';

export type AppLanguage = 'fr' | 'en' | 'ar';

/**
 * Central language management service.
 * Handles language selection, persistence, and translation lookup.
 * All components react via the `activeLanguage` signal.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'digital-life-twin-language';
  private readonly availableLanguages = ['fr', 'en', 'ar'] as const;

  private readonly translations: Record<AppLanguage, Record<string, unknown>> = {
    fr: FR_TRANSLATIONS,
    en: EN_TRANSLATIONS,
    ar: AR_TRANSLATIONS,
  };

  /** The currently active language code (reactive). */
  readonly activeLanguage = signal<AppLanguage>('fr');

  /** The currently active language display name (reactive). */
  readonly activeLanguageName = signal<string>('Français');

  constructor() {
    const stored = this.readStoredLanguage();
    this.applyLanguage(stored);
  }

  /** All available languages with their display names and flags. */
  readonly languageOptions: ReadonlyArray<{
    code: AppLanguage;
    name: string;
    flag: string;
  }> = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  /** Get the HTML lang attribute value based on active language. */
  getLangAttr(): string {
    return this.activeLanguage();
  }

  /** Get the document direction (rtl for Arabic, ltr otherwise). */
  getDir(): 'ltr' | 'rtl' {
    return this.activeLanguage() === 'ar' ? 'rtl' : 'ltr';
  }

  /** Get the BCP 47 locale tag used for Intl formatting of the active language. */
  getLocale(): string {
    const locales: Record<AppLanguage, string> = {
      fr: 'fr-FR',
      en: 'en-US',
      ar: 'ar-EG',
    };
    return locales[this.activeLanguage()];
  }

  /** Set the active language code. Persists and applies document attributes. */
  setLanguage(value: AppLanguage): void {
    if (value === this.activeLanguage()) {
      return;
    }
    this.applyLanguage(value);
  }

  /** Toggle to the next available language. */
  toggleLanguage(): AppLanguage {
    const current = this.activeLanguage();
    const next =
      this.availableLanguages.find((l) => l !== current) ?? 'fr';
    this.setLanguage(next);
    return next;
  }

  /** Translate a key using hierarchical dot notation. */
  translate<T = string>(key: string, vars?: Record<string, string>): T {
    const lang = this.activeLanguage();
    let result: unknown = this.translations[lang];

    const parts = key.split('.');
    for (const part of parts) {
      if (result && typeof result === 'object') {
        result = (result as Record<string, unknown>)[part];
      } else {
        return key as unknown as T;
      }
    }

    if (typeof result === 'string' && vars) {
      Object.entries(vars).forEach(([k, v]) => {
        result = (result as string).replace(
          new RegExp(`{{${k}}}`, 'g'),
          v,
        );
      });
    }

    return result as T;
  }

  /** Reactive translation lookup — returns a signal that updates with the language. */
  translateSignal(key: string, vars?: Record<string, string>): Signal<string> {
    return computed(() => this.translate<string>(key, vars));
  }

  /**
   * Reactive translation of a list of items that each carry a `labelKey`.
   * Returns a signal that re-maps the labels whenever the language changes.
   */
  translateArray<T extends { labelKey: string }>(
    items: ReadonlyArray<T>,
  ): Signal<Array<Omit<T, 'labelKey'> & { label: string }>> {
    return computed(() =>
      items.map((item) => {
        const { labelKey, ...rest } = item;
        return { ...rest, label: this.translate<string>(labelKey) };
      }),
    );
  }

  private readStoredLanguage(): AppLanguage {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored && this.availableLanguages.includes(stored as AppLanguage)) {
        return stored as AppLanguage;
      }
    } catch {
      // storage unavailable — fall back to French
    }
    return 'fr';
  }

  private applyLanguage(lang: AppLanguage): void {
    this.activeLanguage.set(lang);
    this.activeLanguageName.set(this.getLanguageName(lang));

    try {
      localStorage.setItem(this.STORAGE_KEY, lang);
    } catch {
      // storage unavailable — keep in-memory only
    }

    const doc = document.documentElement;
    doc.setAttribute('lang', lang);
    doc.setAttribute('dir', this.getDir());
  }

  private getLanguageName(lang: AppLanguage): string {
    const map: Record<AppLanguage, string> = {
      fr: 'Français',
      en: 'English',
      ar: 'العربية',
    };
    return map[lang];
  }
}
