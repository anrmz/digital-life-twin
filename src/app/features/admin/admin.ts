import { Component } from '@angular/core';
import { FeaturePlaceholder } from '../../shared/components/feature-placeholder/feature-placeholder';
import { LucideShield } from '@lucide/angular';

@Component({
  selector: 'app-admin',
  imports: [FeaturePlaceholder],
  template: `
    <app-feature-placeholder
      [icon]="icon"
      title="Administration"
      description="Statistiques d'utilisation et gestion de la plateforme."
    />
  `,
})
export class AdminComponent {
  protected readonly icon = LucideShield;
}
