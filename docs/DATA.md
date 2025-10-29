# Aula Frontend Data Handling

This document provides an overview of Aula's Frontend data structure.

## Data Architecture

The application has moved from a configuration-based approach to a more component-based architecture for handling data. Data-related functionality is now primarily implemented through dedicated components rather than configuration files.

### Data Services

API communication is now handled through dedicated service modules in the `services/` directory:

- `announcements.ts`: Handles announcement-related API requests
- `auth.ts`: Authentication-related operations
- `boxes.ts`: Box management operations
- `categories.ts`: Category management
- `comments.ts`: Comment functionality
- `consent.ts`: User consent management
- `groups.ts`: User group management
- `ideas.ts`: Idea management
- `messages.ts`: Messaging functionality
- `rooms.ts`: Room management
- `users.ts`: User account operations
- `vote.ts`: Voting functionality

### Data Components

#### DataFields Components

Located in `src/components/DataFields/`, these components provide specialized form fields for different data types:

- **Core Fields**:
  - `ApproveField`: Toggle for approval status
  - `CategoriesField`: Category selection
  - `ConsentField`: User consent options
  - `IconField`: Icon selection
  - `MarkdownEditor`: Rich text editor with markdown
  - `StatusField`: Status management
  
- **Entity-specific Fields**:
  - `IdeaField`: Idea entry field
  - `MessageToField`: Message recipient selection
  - `RoomField`: Room selection
  - `RoomImageSelector`: Room image selection
  - `UserField`: User selection

#### DataForms Components

Located in `src/components/DataForms/`, these components provide specialized form implementations for each data type:

- **Core Forms**:
  - `AnnouncementForms`: Announcement management
  - `BoxForms`: Idea box management
  - `IdeaForms`: Idea management
  - `RoomForms`: Room management
  - `UserForms`: User management
  
- **Supporting Forms**:
  - `BugForms`: Bug report management
  - `CategoryForms`: Category management
  - `CommentForms`: Comment management
  - `GroupForms`: User group management
  - `ReportForms`: Report management
  - `SurveyForms`: Survey management

Each form component:
- Uses React Hook Form for form state
- Implements Yup validation
- Handles loading states
- Supports creation and editing
- Integrates with the permissions system

### Data Scopes

The application handles various data types, each representing a different scope:

#### Basic Scopes:
- **Boxes**: Container for ideas in voting phases
- **Ideas**: User-submitted ideas and proposals
- **Rooms**: Collaboration spaces
- **Users**: User accounts and profiles

#### Message Scopes:
- **Announcements**: System notifications
- **Messages**: Direct communications
- **Reports**: User-submitted reports
- **Bugs**: Bug reports

#### Organization Scopes:
- **Categories**: Classification for ideas
- **Groups**: User group organization
- **Comments**: Feedback on ideas
- **Surveys**: Quick voting containers

## Database Requests

The application uses a centralized `databaseRequest` method located in [src/utils/requests.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/requests.ts) to handle all private API communications. This method provides several key features:

1. **Authentication**: Automatically handles JWT token management by:

   - Including the JWT token in request headers
   - Providing easy access to current user information through token payload
   - Excluding authentication for specific endpoints (e.g., 'checkLogin')

2. **User Context**: Supports automatic injection of user ID into requests through an optional `userId` parameter, making it easier to associate actions with the current user.

3. **Error Handling**: Implements consistent error management across the application:
   - Validates API URL and JWT token presence
   - Handles offline mode detection and redirection
   - Dispatches error events for application-wide error handling

The method interacts with a generic controller (`model.php`) on the backend that handles multiple operations across different models. This architecture provides:

- Centralized request handling
- Consistent error management
- Simplified model operations

### Usage Example:

```typescript
// Basic request
const response = await databaseRequest({
  model: 'users', // The model to operate on
  method: 'getProfile', // The operation to perform
  arguments: { id: 123 }, // Request parameters
});

// Request with automatic user ID injection
const response = await databaseRequest(
  {
    model: 'posts',
    method: 'create',
    arguments: { title: 'New Post' },
  },
  ['author_id']
); // Fields to populate with current user ID
```

The backend's generic controller (`model.php`) processes these requests by:

1. Validating the request and authentication
2. Routing to the appropriate model and method
3. Executing the requested operation
4. Returning a standardized response format
