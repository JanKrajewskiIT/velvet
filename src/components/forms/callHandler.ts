type EventHandlerLike<Event> = ((event: Event) => void) | { 0: (data: unknown, event: Event) => void; 1: unknown };

/** Invokes a Solid event handler prop (plain function or `[handler, data]` tuple) so a component can compose a consumer's handler with its own. */
export const callHandler = <Event>(handler: EventHandlerLike<Event> | undefined, event: Event): void => {
  if (typeof handler === 'function') handler(event);
  else if (handler) handler[0](handler[1], event);
};
