import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '../interfaces/can-component-deactivate';
/**
 * Call canDeactive() function inside the component.ts it true can leave the page otherwise not
 *
 * @see auth.routes.ts
 * @see profile.routes.ts
 * @see posts.routes.ts
 *
 * @param component component who trigger
 * @param currentRoute not used
 * @param currentState not used
 * @param nextState not used
 * @returns
 */
export const leavePageGuardGuard: CanDeactivateFn<CanComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
  return component.canDeactivate? component.canDeactivate() : true;
};
