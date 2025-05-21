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
- [Dialogs and Modals](#dialogs-and-modals)
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

Use the accessible dialog components to manage focus in modals and dialogs:

```tsx
import { AccessibleDialog, AccessibleModal, ConfirmDialog } from '@/components';

// For a standard dialog
<AccessibleDialog
  open={isOpen}
  title="Dialog Title"
  onClose={handleClose}
  initialFocusRef={initialRef}
  finalFocusRef={finalRef}
>
  Dialog content
</AccessibleDialog>

// For a modal
<AccessibleModal
  open={isOpen}
  title="Modal Title"
  onClose={handleClose}
  actions={<Button onClick={handleSave}>Save</Button>}
>
  Modal content
</AccessibleModal>

// For a confirmation dialog
<ConfirmDialog
  open={isOpen}
  title="Confirm Action"
  message="Are you sure you want to proceed?"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

These components implement best practices for dialog accessibility:

- Focus is moved to the dialog when it opens
- Focus is trapped within the dialog while it's open
- Focus returns to the triggering element when the dialog closes
- Dialog state is announced to screen readers
- Keyboard navigation (Escape to close) is supported
- Dialog has proper ARIA attributes (role, aria-labelledby, aria-describedby)

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

## Dialogs and Modals

### Accessible Dialog Components

Our application provides three accessible dialog components:

1. **AccessibleDialog**: A wrapper around MUI Dialog with enhanced accessibility
2. **AccessibleModal**: A custom modal built on MUI Modal with accessibility features
3. **ConfirmDialog**: A specialized dialog for confirmation actions

### Dialog Accessibility Features

All dialog components include these accessibility enhancements:

- **Focus Management**: Automatically moves focus into the dialog when opened and returns focus to the trigger element when closed
- **Focus Trapping**: Prevents keyboard focus from leaving the dialog while it's open
- **Focus Return**: Carefully manages focus return to ensure a smooth user experience when dialogs close
- **Screen Reader Announcements**: Announces dialog opening and closing to screen readers
- **Keyboard Controls**: Supports Escape key to close the dialog
- **Proper ARIA Attributes**: Sets appropriate ARIA roles, labels, and descriptions
- **Content Isolation**: Hides all other content from screen readers while dialog is open using aria-hidden

### Using Accessible Dialog Components

```tsx
// Import the components
import { AccessibleDialog, AccessibleModal, ConfirmDialog } from '@/components/AccessibleDialog';
import { useRef } from 'react';

// Example component with proper focus management
const MyDialogComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Create a ref for the button that opens the dialog
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleClose = () => setIsOpen(false);
  
  const dialogActions = (
    <>
      <Button onClick={handleClose} color="secondary">
        {t('actions.cancel')}
      </Button>
      <Button onClick={handleSave} variant="contained">
        {t('actions.save')}
      </Button>
    </>
  );
  
  return (
    <>
      {/* Button that triggers the dialog */}
      <Button 
        ref={buttonRef}
        onClick={() => setIsOpen(true)}
        variant="contained"
        aria-haspopup="dialog"
      >
        {t('actions.openDialog')}
      </Button>
    
      {/* Accessible dialog with focus return */}
      <AccessibleDialog
        open={isOpen}
        onClose={handleClose}
        title={t('dialog.title')}
        description={t('dialog.description')}
        actions={dialogActions}
        testId="my-dialog"
        // Set the finalFocusRef to return focus to the trigger button
        finalFocusRef={buttonRef}
      >
        <DialogContent>Dialog content goes here</DialogContent>
      </AccessibleDialog>
    </>
  );
};

// Using AccessibleModal with focus management
const MyModalComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  return (
    <>
      <Button ref={buttonRef} onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      
      <AccessibleModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={t('modal.title')}
        showCloseButton={true}
        maxWidth="600px"
        testId="my-modal"
        finalFocusRef={buttonRef}
      >
        <ModalContent>Modal content goes here</ModalContent>
      </AccessibleModal>
    </>
  );
};

// Using ConfirmDialog with focus management
const MyConfirmComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  
  return (
    <>
      <Button 
        ref={deleteButtonRef} 
        color="error" 
        onClick={() => setIsOpen(true)}
      >
        Delete Item
      </Button>
      
      <ConfirmDialog
        open={isOpen}
        title={t('confirm.title')}
        message={t('confirm.message')}
        confirmText={t('actions.delete')}
        cancelText={t('actions.cancel')}
        confirmColor="error"
        onConfirm={handleDeleteItem}
        onCancel={() => setIsOpen(false)}
        testId="confirm-dialog"
        // The ConfirmDialog component will handle passing this to AccessibleDialog
        finalFocusRef={deleteButtonRef}
      />
    </>
  );
};
```

### Dialog Migration Status

We're in the process of migrating all dialog and modal components to use our accessible dialog components. The following components have been updated:

- `DeleteButton`: Now uses the `ConfirmDialog` component
- `ReportButton`: Now uses the `AccessibleModal` component
- `BugButton`: Now uses the `AccessibleModal` component
- `AddIdeasButton`: Now uses the `AccessibleDialog` component
- `DelegateVote`: Now uses the `AccessibleDialog` component

Components still needing migration include:

- Other button components in the `Buttons` directory
- Dialogs in the `DataFields` directory
- Dialogs in various view components

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
- `useFocusTrap`: Manages focus within a modal dialog
- `useModalAnnouncement`: Announces modal state to screen readers
- `useEscapeKey`: Handles escape key press to close dialogs

### Accessible Components

- `LoadingIndicator`: Displays loading states with proper announcements
- `SkipNavigation`: Allows keyboard users to bypass navigation
- `PopupMessages`: Provides screen reader announcements for notifications
- `AccessibleDialog`: A fully accessible dialog component
- `AccessibleModal`: A fully accessible modal component
- `ConfirmDialog`: An accessible confirmation dialog

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Material-UI Accessibility](https://mui.com/material-ui/guides/accessibility/)