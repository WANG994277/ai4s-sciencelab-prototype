export function parentMessageOrigin() {
  return window.location.protocol === 'file:' ? '*' : window.location.origin;
}

export function isParentMessage(event: MessageEvent) {
  return event.source === window.parent &&
    (window.location.protocol === 'file:' || event.origin === window.location.origin);
}
