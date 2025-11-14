# Accessibility Guide

## Overview

GitCaster is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

## Standards Compliance

We aim to conform to **WCAG 2.1 Level AA** standards.

## Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the application
- Skip navigation links for main content
- Visible focus indicators
- Keyboard shortcuts for common actions

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and roles where appropriate
- Alt text for all images
- Descriptive link text
- Form labels properly associated
- Error messages announced
- Dynamic content updates announced

### Visual Accessibility
- Sufficient color contrast (4.5:1 minimum)
- Text resizing up to 200%
- No reliance on color alone
- Consistent visual design
- Clear typography
- Adjustable font sizes

### Motor Accessibility
- Large click targets (44x44px minimum)
- Adequate spacing between interactive elements
- No time limits on interactions
- Undo functionality where appropriate

## Testing

### Manual Testing
- Keyboard-only navigation
- Screen reader testing (NVDA, JAWS, VoiceOver)
- High contrast mode
- Browser zoom testing
- Mobile accessibility

### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y

# Lighthouse accessibility audit
npm run lighthouse

# axe-core testing
npm run test:axe
```

### Testing Tools
- axe DevTools
- Lighthouse
- WAVE
- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard navigation testing

## Implementation Guidelines

### Semantic HTML
```typescript
// Good: Semantic elements
<nav><button><header><main><footer>

// Avoid: Generic divs for everything
<div class="button"><div class="nav">
```

### ARIA Labels
```typescript
// Provide labels for screen readers
<button aria-label="Close dialog">×</button>

// Describe dynamic content
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

### Keyboard Support
```typescript
// Handle keyboard events
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
  Action
</div>
```

### Focus Management
```typescript
// Manage focus for modals
useEffect(() => {
  if (isOpen) {
    firstFocusableElement.current?.focus();
  }
}, [isOpen]);
```

## Common Patterns

### Buttons
- Use `<button>` for actions
- Include descriptive text or aria-label
- Ensure keyboard accessibility

### Forms
- Associate labels with inputs
- Provide clear error messages
- Mark required fields
- Use fieldsets for groups

### Images
- Provide alt text
- Use empty alt for decorative images
- Include long descriptions for complex images

### Navigation
- Use semantic nav elements
- Provide skip links
- Maintain logical tab order
- Highlight current page

### Modals/Dialogs
- Trap focus within modal
- Return focus on close
- Allow Escape key to close
- Provide close button

### Tables
- Use proper table markup
- Include headers
- Provide captions
- Use scope attributes

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Reporting Issues

If you encounter accessibility issues:
1. Open a GitHub issue
2. Describe the problem
3. Include your setup (browser, screen reader, etc.)
4. Suggest improvements if possible

## Commitment

We are committed to:
- Regular accessibility audits
- User testing with assistive technologies
- Ongoing training for developers
- Continuous improvement
- Addressing reported issues promptly

