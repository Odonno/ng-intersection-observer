import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IntersectionObserverService } from './intersection-observer.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[observeVisibility]',
})
export class ObserveVisibilityDirective
  implements OnDestroy, OnInit, AfterViewInit
{
  @Input() observeVisibilityRoot?: Element | Document | null;

  @Input() observeVisibilityRootMargin?: string;

  /**
   * The threshold value to detect when an element is partially/fully visible in the viewport.
   * Example: 0 means that the element is visible when at least 1px of its area is visible in the viewport.
   * Example: 0.5 means that the element is visible at least 50% of its area is visible in the viewport.
   * Example: 1 means that the element is visible when 100% of its area is visible in the viewport.
   */
  @Input() observeVisibilityThreshold?: number | number[] = 0;

  @Output() visible = new EventEmitter<HTMLElement>();
  @Output() hidden = new EventEmitter<HTMLElement>();

  private observer: IntersectionObserver | undefined;
  private visibleSubscription: Subscription | undefined;
  private hiddenSubscription: Subscription | undefined;

  constructor(
    private readonly element: ElementRef,
    private readonly intersectionObserverService: IntersectionObserverService
  ) {}

  ngOnInit() {
    this.createObserver();
  }

  ngAfterViewInit() {
    this.startObserving();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.unobserve(this.element.nativeElement);
    }

    if (this.visibleSubscription) {
      this.visibleSubscription.unsubscribe();
    }

    if (this.hiddenSubscription) {
      this.hiddenSubscription.unsubscribe();
    }
  }

  private createObserver() {
    const options = {
      root: this.observeVisibilityRoot,
      rootMargin: this.observeVisibilityRootMargin,
      threshold: this.observeVisibilityThreshold,
    };

    this.observer = this.intersectionObserverService.create(options);

    this.visibleSubscription = this.intersectionObserverService
      .whenVisible(this.element.nativeElement)
      .subscribe((entry) => {
        this.visible.emit(entry.target as HTMLElement);
      });

    this.hiddenSubscription = this.intersectionObserverService
      .whenHidden(this.element.nativeElement)
      .subscribe((entry) => {
        this.hidden.emit(entry.target as HTMLElement);
      });
  }

  private startObserving() {
    if (!this.observer) {
      return;
    }

    this.observer.observe(this.element.nativeElement);
  }
}
