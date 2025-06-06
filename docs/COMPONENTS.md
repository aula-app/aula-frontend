# Aula Frontend Components

This document provides an overview of all components used in the Aula Frontend project. Components are organized by category for easier reference.

## Table of Contents

- [Core UI Components](#core-ui-components)
- [Form Components](#form-components)
- [Layout Components](#layout-components)
- [Data Components](#data-components)
- [User Interface Components](#user-interface-components)
- [Feature Components](#feature-components)

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
