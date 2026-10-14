type EventHandlerLike<Event> = ((event: Event) => void) | { 0: (data: unknown, event: Event) => void; 1: unknown };

/** Supports both Solid's function handlers and bound handler tuples. */
export const callHandler = <Event>(handler: EventHandlerLike<Event> | undefined, event: Event): void => {
  if (typeof handler === 'function') handler(event);
  else if (handler) handler[0](handler[1], event);
};
