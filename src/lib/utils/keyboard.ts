/**
 * Keyboard navigation utilities
 */

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Check if key pressed is Enter or Space (activation keys)
 */
export function isActivationKey(key: string): boolean {
  return key === KEYBOARD_KEYS.ENTER || key === KEYBOARD_KEYS.SPACE;
}

/**
 * Check if key pressed is an arrow key
 */
export function isArrowKey(key: string): boolean {
  return [
    KEYBOARD_KEYS.ARROW_UP,
    KEYBOARD_KEYS.ARROW_DOWN,
    KEYBOARD_KEYS.ARROW_LEFT,
    KEYBOARD_KEYS.ARROW_RIGHT,
  ].includes(key);
}

/**
 * Prevent default scroll behavior for Space key
 */
export function preventScrollOnSpace(event: KeyboardEvent) {
  if (event.key === KEYBOARD_KEYS.SPACE) {
    event.preventDefault();
  }
}

/**
 * Handle keyboard navigation in a list
 */
export function handleListKeyboardNavigation(
  event: KeyboardEvent,
  currentIndex: number,
  itemsLength: number,
  onIndexChange: (index: number) => void
) {
  switch (event.key) {
    case KEYBOARD_KEYS.ARROW_DOWN:
      event.preventDefault();
      onIndexChange((currentIndex + 1) % itemsLength);
      break;
    case KEYBOARD_KEYS.ARROW_UP:
      event.preventDefault();
      onIndexChange((currentIndex - 1 + itemsLength) % itemsLength);
      break;
    case KEYBOARD_KEYS.HOME:
      event.preventDefault();
      onIndexChange(0);
      break;
    case KEYBOARD_KEYS.END:
      event.preventDefault();
      onIndexChange(itemsLength - 1);
      break;
  }
}

