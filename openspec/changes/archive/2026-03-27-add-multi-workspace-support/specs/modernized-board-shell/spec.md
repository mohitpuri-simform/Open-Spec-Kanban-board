## ADDED Requirements

### Requirement: The board is presented in a responsive workspace shell

The system SHALL present the application in a modernized layout with a sidebar for workspace navigation and a main content area for the active board.

#### Scenario: Desktop shell layout

- **WHEN** the application is rendered on a desktop-sized viewport
- **THEN** the system SHALL show a persistent sidebar alongside the active board content

#### Scenario: Smaller viewport layout

- **WHEN** the application is rendered on a narrower viewport
- **THEN** the system SHALL preserve access to workspace navigation and board interactions without overlapping or hiding core actions

### Requirement: Core board behavior is preserved within each workspace

The system SHALL preserve list CRUD, card CRUD, drag-and-drop reorder, cross-list moves, and empty-list drop targets inside the active workspace.

#### Scenario: Add and persist list or card changes in a workspace

- **WHEN** the user creates, edits, or deletes a list or card in the active workspace
- **THEN** the system SHALL update only that workspace's board state and persist the result locally

#### Scenario: Move cards inside the active workspace

- **WHEN** the user drags a card within a list or into a different list in the active workspace
- **THEN** the system SHALL update ordering and destination data for that workspace and preserve those changes after reload

### Requirement: Empty and loading states remain usable after the UI refresh

The system SHALL provide clear, accessible feedback for loading and empty board states in the modernized shell.

#### Scenario: Empty workspace state

- **WHEN** the active workspace contains no lists
- **THEN** the system SHALL show a clear call to action to create the first list while keeping workspace navigation available

#### Scenario: Initial hydration state

- **WHEN** persisted state is still being hydrated
- **THEN** the system SHALL render a non-broken loading state instead of incomplete board content
