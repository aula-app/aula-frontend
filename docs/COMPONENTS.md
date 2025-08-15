# Aula Frontend Components

This document provides an overview of all components used in the Aula Frontend project. Components are organized by category for easier reference.

## Table of Contents

- [Core UI Components](#core-ui-components)
- [Form Components](#form-components)
- [Layout Components](#layout-components)
- [Data Components](#data-components)
- [User Interface Components](#user-interface-components)
- [Feature Components](#feature-components)
- [Accessibility Guidelines](#accessibility-guidelines)

## Usage Guidelines

1. Always import components from their index files rather than directly from component files
2. Use the appropriate component for the use case to maintain consistency
3. Follow the component's prop interface for proper usage
4. Refer to individual component documentation for detailed usage examples

## Contributing

When creating new components:

1. Follow the existing component structure
2. Include proper TypeScript types
3. Add loading states where appropriate
4. Document the component in this file
5. Include unit tests

## Core UI Components

### ScopeHeader

A unified header component for scope-based views that provides search and sorting functionality:

- Displays scope title and item count
- Expandable search functionality with text input
- Expandable sort functionality with direction control
- Progressive disclosure UI pattern
- Integrates with filtering and sorting hooks
- See [ScopeHeader Component Documentation](SCOPE-HEADER.md) for detailed usage

### AccessibleDialog

An accessible dialog component that:

- Implements WAI-ARIA dialog practices
- Manages focus properly when opened and closed
- Traps focus within the dialog when open
- Provides screen reader announcements
- Supports keyboard navigation
- Has proper ARIA roles and attributes

### AccessibleModal

A modal component that:

- Provides a consistent modal interface with proper accessibility
- Manages focus and keyboard navigation
- Announces modal state to screen readers
- Implements proper ARIA attributes and keyboard interactions

### ConfirmDialog

A confirmation dialog component that:

- Extends AccessibleDialog for confirmation interactions
- Provides confirm and cancel actions
- Manages loading states
- Implements accessible button focus

### AppIcon

An icon component that:

- Provides a centralized system for managing icons
- Supports both custom SVG icons and icon libraries
- Ensures consistent icon styling across the application

### AppIconButton

A button component specifically designed for icon-only interactions:

- Combines AppIcon with Material-UI's IconButton
- Provides consistent touch targets for better accessibility
- Supports tooltips for better UX

### AppLink

A navigation component that:

- Integrates with React Router for internal navigation
- Supports external links with proper security attributes
- Provides consistent styling for all application links

### AppSubmitButton

A specialized button for form submissions:

- Includes loading state handling
- Provides visual feedback during form submission
- Prevents double submissions

## Form Components

### ChangePassword

A form component for password management:

- Handles password change operations
- Includes validation and security checks
- Provides user feedback on password requirements

### ImageEditor

An interface for image manipulation:

- Supports basic image editing operations
- Handles image upload and processing
- Provides preview functionality

### ImageSelector

A component for selecting images:

- Supports multiple image selection
- Handles image preview
- Integrates with DefaultImages for fallback options

### SetWinnerField

A form field component for marking ideas as winners:

- Provides visual feedback with icon buttons
- Integrates with React Hook Form for state management
- Shows different states (not winner, winner, not marked yet)
- Used by moderators during the result phase

## Layout Components

### BoxCard

A container component that:

- Provides consistent padding and margins
- Supports elevation and borders
- Includes loading state (skeleton) support

### ChatBubble

A component for displaying chat messages:

- Supports different message types
- Handles message alignment (sent/received)
- Includes timestamp and status indicators

### DelegateVote

A voting delegation component:

- Handles vote delegation process
- Shows delegation status
- Manages delegation permissions

### Idea Components

A collection of components for idea management:

- IdeaCard: Displays idea overview
- IdeaBubble: Shows idea in discussion context
- IdeaContent: Renders idea details
- VotingCard: Handles idea voting
- ApprovalCard: Manages idea approval process
- VotingResults: Displays voting results and allows marking ideas as winners

### MessageCard

A card component for displaying messages:

- Supports rich text content
- Handles different message states
- Includes user information display

### RoomCard

A component for displaying room information:

- Shows room status and metadata
- Supports room actions and navigation
- Includes loading state handling

### ReportCard

A component for displaying reports:

- Shows report statistics and data
- Supports different report types
- Includes loading states

## Data Components

Data components are dynamic components for handling forms, tables, and fields related to different data scopes (ideas, rooms, users, etc.) in the application.

More information on this topic is provided in the [data documentation](DATA.md).

### DataTable

A comprehensive table component that:

- Supports pagination
- Handles sorting and filtering
- Provides row actions
- Includes loading states
- Displays data rows based on specified columns

### FilterBar

A component for data filtering:

- Supports multiple filter types
- Handles filter combinations
- Provides clear filter feedback
- Dynamically generates filters based on data type

### DataFields

Located in `src/components/DataFields/`, this set of components provides specialized form fields for different data types:

- `ApproveField`: Handles approval status toggling
- `CategoriesField`: Manages category selection
- `ConsentField`: Manages user consent options
- `IconField`: Provides icon selection interface
- `IdeaField`: Custom field for idea entry
- `MarkdownEditor`: Rich text editor with markdown support
- `MessageToField`: Manages message recipient selection
- `PhaseDurationFields`: Manages phase duration settings
- `RoleField`: User role selection
- `RoomField`: Room selection and management
- `RoomImageSelector`: Image selection for rooms
- `RoomRolesField`: Role management within rooms
- `SelectBoxField`: Box selection interface
- `SelectField`: Generic selection component
- `SelectRoomField`: Room selection interface
- `SetWinnerField`: Winner designation interface
- `StatusField`: Status management component
- `UserField`: User selection interface

### DataForms

Located in `src/components/DataForms/`, these components provide specialized form implementations for each data type:

- `AnnouncementForms`: Create and edit system announcements
- `BoxForms`: Manage idea boxes
- `BugForms`: Create and manage bug reports
- `CategoryForms`: Create and edit categories for ideas
- `CommentForms`: Manage user comments
- `GroupForms`: Create and edit user groups
- `IdeaForms`: Create and edit ideas
- `ReportForms`: Manage user reports
- `RoomForms`: Create and edit rooms
- `SurveyForms`: Create and manage surveys
- `UserForms`: Manage user accounts and profiles

Each form component follows a consistent pattern:

- Uses React Hook Form for form state management
- Implements Yup validation schemas
- Provides loading states during submission
- Handles both creation and editing modes
- Integrates with permissions system
- Uses appropriate field components from DataFields

## User Interface Components

### LocaleSwitch

A language selection component:

- Handles language switching
- Shows current language
- Supports multiple locales

### MoreOptions

A dropdown menu component:

- Provides additional action options
- Supports nested menus
- Handles different permission levels

### PopupMessages

A notification system component:

- Displays system messages
- Supports different message types
- Handles message queuing

## Feature Components

### UserAvatar

A user representation component:

- Displays user avatar
- Handles missing images
- Shows online status

### UserInfo

A component for displaying user information:

- Shows user details
- Handles different user roles
- Displays user status

For more information on contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Accessibility Guidelines

The Aula Frontend is committed to making the application accessible to all users, including those with disabilities. Follow these guidelines when working with components:

### Images and Icons

1. **Meaningful Alt Text**
   - All informative images must have descriptive `alt` text (`alt="Description of image"`)
   - Use translation keys (e.g., `alt={t('image.description')}`) to support multiple languages
   - Alt text should be concise but descriptive of the image's purpose
   - For logos, include the name of the organization (e.g., `alt="Aula Education Platform Logo"`)

2. **Decorative Images**
   - Purely decorative images should be marked with `aria-hidden="true"`
   - Example: `<img src="decorative.jpg" alt="" aria-hidden="true" />`
   - Use the `decorative` prop when available (e.g., `<AppIcon icon="star" decorative={true} />`)
   - In DefaultImage components, SVG illustrations are marked as `aria-hidden="true"` by default unless `alt` prop is provided

3. **SVG Images**
   - SVGs that convey meaning should have the `role="img"` attribute and an appropriate `aria-label`
   - Example: `<svg role="img" aria-label="Description of the image">...</svg>`
   - For DefaultImage components, provide an `alt` prop to make them accessible: `<DefaultImage image={2} alt="Cat illustration" />`
   - For inline SVGs, always include the `role="img"` and `aria-label` attributes if they're not decorative
   - Never use SVGs with meaningful content without proper accessibility attributes

4. **Icon Components**
   - The AppIcon component accepts a `decorative` prop (default: true)
   - Set `decorative={false}` only when the icon conveys information not available elsewhere
   - When icons are used for visual enhancement only, keep `decorative={true}`
   - When using `decorative={false}`, the component will automatically add `role="img"` and an appropriate `aria-label`

5. **Button Content**
   - When a button contains only an icon, ensure it has an accessible name via `aria-label`
   - Example: `<Button aria-label={t('action.delete')}><AppIcon icon="trash" /></Button>`
   - When using AppIconButton, provide a title prop for tooltip and accessibility

### Interactive Elements

1. **Focus Management**
   - Ensure all interactive elements are keyboard accessible
   - Maintain visible focus indicators for keyboard navigation

2. **Form Components**
   - All form controls must have associated labels
   - Error messages should be linked to their respective inputs
   - Use aria-invalid to indicate validation errors

### Roles and ARIA Attributes

1. **Landmark Roles**
   - Use appropriate semantic HTML elements (`<main>`, `<nav>`, `<header>`, etc.)
   - Add ARIA roles when semantic HTML isn't available

2. **Dynamic Content**
   - Use aria-live regions for content that updates dynamically
   - Ensure screen readers are notified of important changes
   - Use the `announceToScreenReader` utility for dynamic announcements
   - Implement `LoadingIndicator` component for loading states with proper announcements
   - Use live regions for form submissions, loading states, and content updates

### Testing

1. **Keyboard Navigation**
   - Verify all functionality is accessible via keyboard
   - Test tab order for logical navigation flow

2. **Screen Reader Testing**
   - Test components with screen readers (NVDA, VoiceOver, JAWS)
   - Ensure all content is properly announced

For more detailed accessibility guidelines, refer to [WCAG 2.1 AA standards](https://www.w3.org/WAI/WCAG21/quickref/).
