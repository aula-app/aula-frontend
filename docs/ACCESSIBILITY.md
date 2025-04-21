# Accessibility Guidelines for Aula Frontend

## Overview

This document outlines accessibility standards and best practices for the Aula frontend application. Following these guidelines ensures our application is usable by people with diverse abilities.

## Standards We Follow

- [WCAG 2.1 AA compliance](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA 1.1](https://www.w3.org/TR/wai-aria-1.1/)

## Core Principles

1. **Perceivable**: Information and UI components must be presentable to users in ways they can perceive.
2. **Operable**: UI components and navigation must be operable by diverse users.
3. **Understandable**: Information and operation of the UI must be understandable.
4. **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

## Implementation Guidelines

### Semantic HTML

- Use the most appropriate HTML elements for their intended purpose
- Use heading levels correctly (h1, h2, etc.) to maintain document structure
- Use lists (`<ul>`, `<ol>`, `<dl>`) for list content
- Use `<button>` for clickable actions, `<a>` for navigation

### ARIA Attributes

- Add `aria-label` or `aria-labelledby` to elements that need additional description
- Use `aria-expanded`, `aria-controls`, and `aria-hidden` appropriately
- Use landmark roles (`role="navigation"`, `role="main"`, etc.)
- Add `aria-live` regions for dynamic content

### Focus Management

- Ensure all interactive elements are keyboard accessible
- Maintain a logical tab order
- Provide visible focus indicators
- Implement skip links for main content

### Images and Media

- Include alternative text for images with `alt` attributes
- Provide captions and transcripts for video and audio content
- Ensure controls for media are accessible

### Color and Contrast

- Maintain minimum contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Don't rely solely on color to convey information
- Test with color blindness simulators

### Forms and Input

- Associate labels with form controls
- Provide clear error messages and validation
- Group related form elements with `<fieldset>` and `<legend>`

### Testing

- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test keyboard-only navigation
- Use the axe DevTools for automated testing
- Conduct user testing with people who use assistive technologies

## Tooling

- **@axe-core/react**: For automated accessibility testing
- **eslint-plugin-jsx-a11y**: For linting accessibility issues
- **react-focus-lock**: For managing focus in modals and dialogs

## Resources

- [A11Y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Resources](https://webaim.org/resources/)