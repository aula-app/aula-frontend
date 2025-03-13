# Introduction to _Aula_

_Aula_ implements a democratic process that enables students to propose and discuss ideas, which then progress through multiple approval phases until final acceptance through voting.

## Core Concepts

### Scopes

Data in _Aula_ is organized into several hierarchical scopes, each with different access levels and capabilities:

#### Ideas

Ideas are the fundamental element of _Aula's_ democratic process. They are the primary scope that receives user interaction through:

- Comments
- Likes
- Votes

Each Idea must be linked to a specific Room. When associated with a Box, Ideas can progress through defined voting phases. Otherwise, they remain available for discussion as "Wild Ideas".

#### Boxes

Boxes are controlled spaces that group related Ideas together. They define how Ideas progress through the voting phases and are always linked to a specific Room.

#### Rooms

Rooms organize access between different scopes. They mediate user access to specific Boxes and Ideas based on room assignments.

#### Users

Users represent individual participants in the system. Each user profile contains:

- Personal information
- Interaction permissions (based on user roles)
- Room assignments (users must be linked to at least one Room)

### Voting Phases

Ideas assigned to a Box progress through four sequential phases:

1. **Discussion**

   - Initial stage for public scrutiny
   - Ideas can be discussed and refined
   - Transforms raw ideas into formal proposals

2. **Approval**

   - Pragmatic analysis by school staff
   - Ideas are evaluated for feasibility
   - Staff must provide explicit reasoning for approval or dismissal

3. **Voting**

   - Approved Ideas enter public voting
   - Voting is limited to students assigned to the relevant Room
   - Voting quorum is calculated based on Room membership

4. **Result**
   - Winning Ideas are displayed
   - Results are considered collectively within Boxes
   - Moderators can mark specific ideas as winners
   - Voting can be configured to:
     - Approve multiple Ideas in a Box
     - Select a single winning Idea from the Box

### User Roles

The system defines six permission levels:

| Role            | Capabilities                                 |
| --------------- | -------------------------------------------- |
| Guest           | Read-only access                             |
| Student         | Can comment and interact with content        |
| Moderator       | Can moderate assigned Rooms and mark winners |
| Super Moderator | Can moderate all school Rooms                |
| School Admin    | Full access to administrative settings       |
| Tech Admin      | Access to technical configuration only       |

## Additional features

Alongside _Aula_'s voting system, there are other functions that support School's interaction with the Students:

- _Announcements_ - Read-only messages that may or may not require student agreement
- _Messages_ - A simple messaging system that can send messages to `Users`, be it individual students, `Groups` or `Rooms`
- _Reports_ - A system where `Users` can report inappropriate behavior or bugs
- _Vote Delegation_ - An advanced interaction system, scoped within `Boxes`, where `Users` can delegate their votes to other `Users`, who will become their representatives during the voting phase
- _Winner Selection_ - Moderators can manually mark specific ideas as winners after the voting phase
