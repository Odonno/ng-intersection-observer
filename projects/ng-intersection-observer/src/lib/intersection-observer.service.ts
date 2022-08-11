import { Injectable } from '@angular/core';
import { filter, map, Subject } from 'rxjs';

const getElementPath = (element: Element) => {
  const path: Element[] = [];
  let pathElement: Element | null = element;

  while (pathElement) {
    path.push(pathElement);
    pathElement = pathElement.parentElement;
  }

  return path
    .reverse()
    .map((element) => element.tagName + (element.id ? '#' + element.id : ''))
    .join(' > ');
};

@Injectable({
  providedIn: 'root',
})
export class IntersectionObserverService {
  private readonly map = new Map<string, IntersectionObserver>();
  private readonly eventSubject = new Subject<CustomEvent>();

  create(options?: IntersectionObserverInit) {
    const isDocumentRoot = options?.root === document;
    const rootKey = options?.root
      ? isDocumentRoot
        ? 'document'
        : getElementPath(options.root as Element)
      : undefined;

    const shouldCheckUniqueRoot = options?.root && !isDocumentRoot;

    if (shouldCheckUniqueRoot) {
      const hasRootId = (options.root as Element).id;

      if (!hasRootId) {
        console.warn(
          "The root element doesn't have an id. This can cause unexpected behavior."
        );
      }
    }

    const key = JSON.stringify({
      root: rootKey,
      rootMargin: options?.rootMargin,
      threshold: options?.threshold,
    });

    if (this.map.has(key)) {
      return this.map.get(key);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.eventSubject.next(
            new CustomEvent('visible', {
              detail: entry,
            })
          );
        } else {
          this.eventSubject.next(
            new CustomEvent('hidden', {
              detail: entry,
            })
          );
        }
      });
    }, options);

    this.map.set(key, observer);

    return observer;
  }

  whenVisible(element: Element) {
    return this.eventSubject.pipe(
      filter((event) => event.type === 'visible'),
      map((event) => event.detail),
      filter((entry) => entry.target === element)
    );
  }

  whenHidden(element: Element) {
    return this.eventSubject.pipe(
      filter((event) => event.type === 'hidden'),
      map((event) => event.detail),
      filter((entry) => entry.target === element)
    );
  }
}
