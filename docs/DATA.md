# Aula Frontend Data Handling

This document provides an overview of Aula's Frontend data structure.

## Data

The data structure files are stored in `src/utils/Data/DataConfig`. Each file corresponds to a different data type, according to the database tables.

These files are structured containing:

- _columns_: A list of objects containing the name and orderId of each column to be displayed on the [settings menu tables](https://github.com/aula-app/aula-frontend/tree/main/src/views/Settings/).
- _fields_: A list of objects containing the definition of the forms to be displayed on the [edit data](https://github.com/aula-app/aula-frontend/tree/main/src/components/Data/EditData) dialog.
- _requests_: defines endpoints and model names for CRUD operations.

For our purposes, we will consider each data type as a different _scope_:

### Basic Scopes:

- **Boxes** ([boxesFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/boxesFields.ts)): Defines the structure for `idea boxes` where `ideas` are grouped in order to progress through the voting phases.
- **Ideas** ([ideasFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/ideasFields.ts)): Contains the structure for user-submitted ideas.
- **Rooms** ([roomsFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/roomsFields.ts)): Defines spaces where users can collaborate and discuss ideas.
- **Users** ([usersFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/usersFields.ts)): Contains user profile and account information structure.

### Message Scopes:

- **Announcements** ([announcementsFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/announcementsFields.ts)): Defines system-wide announcements and notifications.
- **Messages** ([messagesFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/messagesFields.ts)): Contains structure for direct communication with individual or groups of users.
- **Bugs** ([bugFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/bugFields.ts)): Defines bug report structure and tracking.
- **Reports** ([reportFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/reportFields.ts)): Contains structure for user-submitted reports and feedback.

### Idea Related Scopes:

- **Categories** ([categoriesFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/categoriesFields.ts)): Defines classification and organization structure for ideas.
- **Comments** ([commentsFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/commentsFields.ts)): Contains structure for user feedback and discussions on ideas.

### User Related Scopes:

- **Groups** ([groupFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/groupFields.ts)): Defines user group organization.

### Accessory Scopes:

- **Surveys** ([suveysFields.ts](https://github.com/aula-app/aula-frontend/tree/main/src/utils/Data/DataConfig/suveysFields.ts)): Contains structure for creation of special boxes, with defined ideas and immediate voting, skipping Discussion and Approval phases.

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
