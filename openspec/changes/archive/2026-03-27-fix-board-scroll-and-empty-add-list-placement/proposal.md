## Why

The board currently scrolls horizontally when more than three lists are added, which makes ongoing list management harder than expected. In addition, the add-list control sits off to the side when a workspace is empty, creating a mismatch with the centered empty-state message and reducing clarity for first-time actions.

## What Changes

- Change the board list region behavior so that list overflow beyond the visible threshold is handled with vertical scrolling rather than horizontal scrolling.
- Update the empty workspace state so the add-list input/action appears centered with the empty-state message.
- Keep list/card CRUD, drag-and-drop, and localStorage persistence behavior unchanged while adjusting layout and overflow handling.
- Ensure the updated empty-state add-list control remains accessible and keyboard friendly.

## Capabilities

### New Capabilities

- `board-overflow-and-empty-state-layout`: Define requirements for vertical list overflow behavior and centered empty-state add-list placement.

### Modified Capabilities

- None.

## Goals

- Remove horizontal board scrolling caused by adding many lists.
- Provide a centered add-list action in the empty workspace state, aligned with the empty-state message.
- Preserve existing list/card CRUD, drag-and-drop, and local persistence behavior.

## Non-goals

- Changing board data models or storage schema.
- Altering drag-and-drop interaction semantics.
- Introducing backend APIs or additional workspace management actions.

## User experience

When many lists exist, users can continue browsing list content without being forced into horizontal board panning. When no lists exist in a workspace, users see a centered empty-state message with the add-list input/action in the same focal area, making the first action obvious.

## Success criteria

- Adding more than three lists no longer forces horizontal board scrolling.
- The empty workspace state shows the add-list input/action centered near the empty-state message.
- Existing list/card CRUD, drag-and-drop, and localStorage behavior continue to work after the layout change.

## Impact

- Affected code: board layout component and related styling classes.
- No dependency changes expected.
- No localStorage schema or migration changes required.
