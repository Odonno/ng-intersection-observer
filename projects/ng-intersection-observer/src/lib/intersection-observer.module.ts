import { NgModule } from '@angular/core';
import { ObserveVisibilityDirective } from './observe-visibility.directive';

@NgModule({
  declarations: [ObserveVisibilityDirective],
  exports: [ObserveVisibilityDirective],
})
export class IntersectionObserverModule {}
