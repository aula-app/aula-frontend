# Accessibility Guidelines for Aula Frontend

This document provides comprehensive guidelines for ensuring accessibility in the Aula Frontend application. These guidelines are based on WCAG 2.1 AA standards and aim to make the application usable by people with diverse abilities.

## Table of Contents

- [Introduction](#introduction)
- [Core Accessibility Principles](#core-accessibility-principles)
- [Dynamic Content Announcements](#dynamic-content-announcements)
- [Images and Icons](#images-and-icons)
- [Forms and Inputs](#forms-and-inputs)
- [Keyboard Navigation](#keyboard-navigation)
- [Color and Contrast](#color-and-contrast)
- [Screen Readers](#screen-readers)
- [Testing](#testing)
- [Utilities and Components](#utilities-and-components)

## Introduction

Accessibility is a fundamental aspect of the Aula Frontend. Our goal is to ensure that all users, regardless of their abilities, can use the application effectively. This includes users with visual, auditory, motor, or cognitive impairments.

## Core Accessibility Principles

1. **Perceivable**: Information and UI components must be presentable to users in ways they can perceive
2. **Operable**: UI components and navigation must be operable by all users
3. **Understandable**: Information and UI operation must be understandable
4. **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies

## Dynamic Content Announcements

### Live Regions

The application uses ARIA live regions to announce dynamic content changes to screen reader users:

```tsx
// Example of a live region in PopupMessages.tsx
<Box
  id="a11y-live-announcer"
  aria-live="polite"
  aria-atomic="true"
  sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}
/>
```

### Announcement Utility

Use the `announceToScreenReader` utility to announce dynamic content changes:

```tsx
import { announceToScreenReader } from '@/utils';

// Announce a message to screen readers
announceToScreenReader('Content has been updated', 'polite');

// For critical updates, use assertive politeness
announceToScreenReader('Form submission failed', 'assertive');
```

### Loading State Announcements

Use the `announceLoadingState` utility to announce loading state changes:

```tsx
import { announceLoadingState } from '@/utils';

// Announce start of loading
announceLoadingState(true, 'Ideas');

// Announce end of loading
announceLoadingState(false, 'Ideas');
```

### LoadingIndicator Component

The `LoadingIndicator` component provides a consistent way to display loading states with proper screen reader announcements:

```tsx
import { LoadingIndicator } from '@/components';

// In your component render function
return (
  <div>
    <LoadingIndicator 
      isLoading={isLoading} 
      resourceName={t('scopes.ideas.plural')} 
    />
    {/* Other content */}
  </div>
);
```

## Images and Icons

### Meaningful Images

All meaningful images must have descriptive alt text:

```tsx
<img src="/logo.png" alt={t('app.name.logo')} />
```

### Decorative Images

Decorative images should be marked with `aria-hidden="true"` and an empty alt attribute:

```tsx
<img src="/decoration.png" alt="" aria-hidden="true" />
```

### SVG Icons

SVGs that convey meaning should use the `role="img"` attribute and an appropriate `aria-label`:

```tsx
<svg role="img" aria-label="Star rating">
  {/* SVG content */}
</svg>
```

### AppIcon Component

The `AppIcon` component supports accessibility through the `decorative` prop:

```tsx
// Decorative icon (default)
<AppIcon icon="star" decorative={true} />

// Meaningful icon
<AppIcon icon="warning" decorative={false} />
```

## Forms and Inputs

### Labeling Inputs

All form controls must have associated labels:

```tsx
<TextField
  id="idea-title"
  label={t('settings.columns.title')}
  // Other props
  slotProps={{
    input: {
      'aria-labelledby': 'idea-title-label',
    },
    inputLabel: {
      id: 'idea-title-label',
      htmlFor: 'idea-title',
    },
  }}
/>
```

### Error Messages

Connect error messages to their inputs:

```tsx
<TextField
  // Other props
  error={!!errors.title}
  helperText={
    <span id="title-error-message">
      {typeof errors.title?.message === 'string' ? errors.title.message : ''}
    </span>
  }
  slotProps={{
    input: {
      'aria-invalid': !!errors.title,
      'aria-errormessage': errors.title ? 'title-error-message' : undefined,
    },
  }}
/>
```

### Form Submission Announcements

Announce form submission states:

```tsx
const onSubmit = async (data) => {
  try {
    setIsLoading(true);
    announceToScreenReader(t('ui.accessibility.processingRequest'), 'assertive');
    
    await submitForm(data);
    
    announceToScreenReader(t('ui.accessibility.formSubmitted'), 'assertive');
  } catch (error) {
    announceToScreenReader(t('ui.accessibility.formError'), 'assertive');
  } finally {
    setIsLoading(false);
  }
};
```

## Keyboard Navigation

### Focus Management

Ensure all interactive elements are keyboard accessible:

- All buttons, links, and form controls must be focusable
- Maintain a logical tab order
- Provide visible focus indicators

### Skip Navigation

Use the `SkipNavigation` component to allow keyboard users to bypass navigation:

```tsx
<SkipNavigation skipToId="main-content" />
<main id="main-content">
  {/* Main content */}
</main>
```

### Focus Trapping

Implement focus trapping in modal dialogs:

- Focus should be moved to the dialog when it opens
- Focus should remain within the dialog while it's open
- Focus should return to the triggering element when the dialog closes

## Color and Contrast

### Contrast Requirements

- Text must have a contrast ratio of at least 4.5:1 (3:1 for large text)
- UI components and graphical objects must have a contrast ratio of at least 3:1

### Color Independence

Information must not be conveyed by color alone:

- Always use additional indicators (text, shapes, patterns)
- Ensure all information is accessible without color perception

## Screen Readers

### Landmarks

Use appropriate landmark roles to help screen reader users navigate:

```tsx
<header role="banner">
  {/* Header content */}
</header>
<nav role="navigation">
  {/* Navigation content */}
</nav>
<main role="main">
  {/* Main content */}
</main>
<footer role="contentinfo">
  {/* Footer content */}
</footer>
```

### ARIA Attributes

Use ARIA attributes to enhance accessibility when needed:

- `aria-label`: Provides a label for an element
- `aria-labelledby`: Associates an element with another element that serves as its label
- `aria-describedby`: Associates an element with another element that provides additional description
- `aria-expanded`: Indicates whether a control is expanded or collapsed
- `aria-controls`: Identifies the element whose contents are controlled by the current element

## Testing

### Automated Testing

Use automated tools to catch basic accessibility issues:

- ESLint with jsx-a11y plugin
- Automated accessibility testing in CI/CD pipeline

### Manual Testing

Perform manual testing with assistive technologies:

- Keyboard-only navigation
- Screen reader testing (NVDA, VoiceOver, JAWS)
- Test with magnification
- Test with high contrast mode

## Utilities and Components

### Accessibility Utilities

- `announceToScreenReader`: Announces messages to screen readers
- `announceLoadingState`: Announces loading state changes

### Accessible Components

- `LoadingIndicator`: Displays loading states with proper announcements
- `SkipNavigation`: Allows keyboard users to bypass navigation
- `PopupMessages`: Provides screen reader announcements for notifications

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Material-UI Accessibility](https://mui.com/material-ui/guides/accessibility/)