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

Data components are dynamic components based on data configurations for each scope types and definitions located at `src/utils/Data/DataConfig/`.

More information on this topic is provided on the [data documentation](DATA.md).

These files are structured with the following objects:

- _columns_: a list of columns to be displayed on the tables.
- _fields_: a list with the definition of the forms to be displayed on the EditData dialog.
- _requests_: a dictionary containing the endpoints and model names for CRUD operations

These objects are used on the following components:

### DataTable

A comprehensive table component that:

- Supports pagination
- Handles sorting and filtering
- Provides row actions
- Includes loading states

It is populated by the information set on the _columns_ settings of each data scope (ideas, rooms, etc.)

### FilterBar

A component for data filtering:

- Supports multiple filter types
- Handles filter combinations
- Provides clear filter feedback

It is populated by the information set on the _columns_ settings of each data scope (ideas, rooms, etc.)

For more information, please check the _Data_ section under the (utils documentation)[UTILS.md].

### EditData System

A dialog system that dynamically generates and manages forms based on data configurations. It is populated by the information set on the _fields_ settings of each data scope (ideas, rooms, etc.).

The system consists of several key parts:

#### EditData.tsx

The main component that serves as a form dialog generator. It:

- Renders a Material-UI Drawer containing dynamic form fields
- Uses React Hook Form for form state management and validation
- Loads field configurations from DataConfig based on the provided scope
- Handles form submission and data updates
- Supports both creation and editing modes
- Manages phase-dependent field visibility
- Integrates with a permission system for field access control

#### FormField System

Located in `src/components/Data/EditData/FormField/`, handles the rendering of individual form fields, according to the above mentioned setting:

- Supports multiple field types:
  - `custom`: Custom field implementations
  - `duration`: Time duration inputs
  - `icon`: Icon selection
  - `image`: Image upload/selection
  - `select`: Dropdown selections
  - `singleDuration`: Single duration input
  - `phaseSelect`: Phase selection dropdown
  - `target`: Message target selection
  - Default text/input fields

#### DataUpdates System

Located in `src/components/Data/EditData/DataUpdates/`, handles specific update operations based on the newly created entry, after receiving it's ID:

- Adding Users to Rooms
- Adding Boxes to Rooms
- Adding Ideas to Boxes
- Setting Users or groups as target for messages
- etc...

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
