import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '../posts/interfaces/can-component-deactivate';

export const leavePageGuardGuard: CanDeactivateFn<CanComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
  return component.canDeactivate? component.canDeactivate() : true;
};
