## ADDED Requirements

### Requirement: Board list overflow uses vertical flow instead of horizontal scrolling

The system SHALL present additional lists without requiring horizontal board scrolling when list count grows beyond the initially visible set.

#### Scenario: More than three lists exist

- **WHEN** a workspace has more than three lists
- **THEN** the board layout SHALL continue rendering lists using vertical flow/wrapping and SHALL NOT require horizontal scrolling to reach added lists

#### Scenario: Drag-and-drop with wrapped lists

- **WHEN** a user drags cards within or across lists in a wrapped layout
- **THEN** existing drag-and-drop behavior SHALL remain functional with unchanged reorder and move outcomes

### Requirement: Empty-state add-list action is centered with empty-state messaging

The system SHALL render the add-list input and action in the centered empty-state region when a workspace contains no lists.

#### Scenario: Workspace has zero lists

- **WHEN** the active workspace has no lists
- **THEN** the user SHALL see the empty-state message and add-list action centered together in the same focal region

#### Scenario: Creating first list from empty state

- **WHEN** the user submits a valid list title from the centered empty-state add-list control
- **THEN** the list SHALL be created, persisted, and the board SHALL transition to the non-empty layout

### Requirement: Existing CRUD and persistence behavior are preserved

The system MUST keep list/card CRUD and localStorage persistence behavior unchanged after layout updates.

#### Scenario: Reload after creating lists and cards

- **WHEN** a user creates or modifies lists/cards and reloads the page
- **THEN** the saved board state SHALL be restored with the same data and layout behavior
