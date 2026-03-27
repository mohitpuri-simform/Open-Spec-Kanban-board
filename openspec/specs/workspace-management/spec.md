### Requirement: Users can manage multiple workspaces

The system SHALL allow users to maintain multiple independent workspaces, each with its own board state, and switch the active workspace from a persistent sidebar.

#### Scenario: Create a new workspace

- **WHEN** the user activates the create workspace action
- **THEN** the system creates a new workspace with a unique identifier, appends it to the sidebar, assigns it a default sequential name, and makes it the active workspace

#### Scenario: Switch active workspace

- **WHEN** the user selects a different workspace from the sidebar
- **THEN** the system SHALL display that workspace's board state without altering the data of any other workspace

### Requirement: Workspace names are editable and drive the active title

The system SHALL allow the active workspace name to be edited, and the active workspace name MUST be used for the board header and the browser document title.

#### Scenario: Rename active workspace

- **WHEN** the user submits a non-empty new name for the active workspace
- **THEN** the system SHALL persist the updated name and immediately reflect it in the visible header and document title

#### Scenario: Reject blank workspace names

- **WHEN** the user clears the workspace name and leaves the field empty
- **THEN** the system SHALL restore the previous non-empty workspace name and keep that value persisted

### Requirement: Existing single-board data migrates into the workspace model

The system SHALL migrate a valid legacy single-board localStorage payload into a multi-workspace structure on first load by creating a default workspace named `Workspace 1`.

#### Scenario: Migrate legacy board data

- **WHEN** the system loads and finds no multi-workspace storage but does find valid legacy board storage
- **THEN** the system SHALL hydrate one workspace named `Workspace 1`, preserve the stored lists and cards, and mark it as the active workspace

#### Scenario: Recover from invalid stored data

- **WHEN** the system loads and finds invalid or incompatible persisted workspace data
- **THEN** the system SHALL fall back to a fresh default workspace state and continue functioning without crashing
