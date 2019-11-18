import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
  animateChild,
} from '@angular/animations';

export const routeTransitionAnimations = trigger('triggerName', [
  transition(
    'Three => Four, One => Two, One => Three, One => Six, Two => Six, Home => One, Home => Two, Home => Six',
    [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':enter', animateChild()),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(
            '0.5s ease-in-out',
            style({ transform: 'translateX(-100%)', opacity: 0 }),
          ),
        ]),
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate(
            '0.5s ease-in-out',
            style({ transform: 'translateX(0%)', opacity: 1 }),
          ),
        ]),
      ]),
    ],
  ),
  transition(
    'Six => Two, Six => One, Two => One, Three => One, Three => Two, Three => Six',
    [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':enter', animateChild()),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate(
            '0.5s ease-in-out',
            style({ transform: 'translateX(100%)', opacity: 0 }),
          ),
        ]),
        query(':enter', [
          style({ transform: 'translateX(-100%)' }),
          animate(
            '0.5s ease-in-out',
            style({ transform: 'translateX(0%)', opacity: 1 }),
          ),
        ]),
      ]),
    ],
  ),
]);
