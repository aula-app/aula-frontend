# Aula Frontend Views

This document provides an overview of all views in the Aula Frontend project. Views represent the different pages and major UI components of the application.

## Core Views

### NotFoundView

A "404 Not Found" error page that:

- Displays the Aula happy logo
- Shows a translated "not found" message
- Provides a user-friendly error experience

### NotImplementedView

A placeholder view for features under development that:

- Shows a "under construction" message
- Provides a link back to the home page
- Displays the current URL path and parameters
- Can be customized with a component name

### OfflineView

A view displayed when the application is in offline mode that:

- Shows the Aula happy logo
- Displays a translated offline message
- Provides a logout button in the top-left corner

## Feature Views

### About

Contains views related to application information and documentation.

### AskConsent

Handles user consent flows and privacy-related interactions.

### Dashboard

The main user dashboard view providing an overview of:

- User's activities
- Recent updates
- Important notifications
- Quick access to key features

### Idea

Views for managing individual ideas, including:

- Idea details
- Discussion threads
- Voting interfaces
- Idea history

### IdeasBox

Views for managing Idea Boxes (Named as Topics on the Backend), including:

- Idea listings
- Filtering and sorting options
- Idea creation interfaces
- Bulk actions

### Messages

Messaging system views including:

- Message threads
- Inbox/outbox
- Message composition
- Notification settings

### Phases

Views related to the different phases of the idea lifecycle:

- Wild Ideas phase
- Discussion phase
- Approval phase
- Voting phase
- Results phase

### Public

Authentication-related views including:

- Login interface
- Sign-up process
- First access password definition
- Authentication flows

### Room

Views for managing and participating in rooms:

- Room details
- Member management
- Room settings
- Activity feeds

### Settings

Application settings views including:

- User preferences
- Account settings
- Notification settings
- Privacy settings
- Admin specific settings
- Technical management settings

### UpdatePassword

Password management views:

- Password change interface
- Password reset flows
- Security settings

### Updates

Views related to system and content updates:

- Update notifications
- Change logs
- Feature announcements

### Welcome

Main landing page for authenticated users that includes:

- User's dashboard with activity overview
- List of user's accessible rooms
- Quick access to key features and notifications

## Usage Guidelines

1. Always import views from their index files rather than directly from view files
2. Follow the established routing patterns when adding new views
3. Implement proper loading states and error boundaries
4. Include proper TypeScript types
5. Add translations for all text content

## Contributing

When creating new views:

1. Follow the existing view structure
2. Include proper TypeScript types
3. Add loading states where appropriate
4. Document the view in this file
5. Include proper error handling
6. Add necessary unit tests

For more information on contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).
