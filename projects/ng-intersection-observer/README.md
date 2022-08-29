# ng-intersection-observer

Intersection Observer for Angular

## Get started

```
npm install ng-intersection-observer --save
```

Once everything is installed, you need to add the module into your own module.

```ts
import { IntersectionObserverModule } from 'ng-intersection-observer';

@NgModule({
    ...,
    imports: [
        IntersectionObserverModule
    ],
    ...
})
export class AppModule { }
```

## How to use?

You can then use the directive inside your components.

```html
<div #container>
  <div
    observeVisibility
    [observeVisibilityRoot]="container"
    [observeVisibilityThreshold]="0"
    (visible)="onVisible()"
    (hidden)="onHidden()"
  ></div>
</div>
```

You will have the possibility to configure the observer with the following params:

- `observeVisibilityRoot` - the root container used - to see if the element is visible (`Document` by default)
- `observeVisibilityRootMargin` - the margin applied to the root container to detect visibility (`0` by default)
- `observeVisibilityThreshold` - the threshold level to detect when the element should be considered visible or hidden (`0` by default)

And then by observing the intersection, you can listen to the following events:

- `visible` - when the element become visible inside the root element
- `hidden` - when the element is now hidden
