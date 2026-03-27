## Context

The board shell was recently modernized and currently renders list columns in a horizontally scrollable row. With more than three lists, this causes horizontal panning, which conflicts with expected reading flow. The empty workspace view also shows a centered instructional message, but the add-list control remains side-aligned, splitting the primary action away from the empty-state focal point.

This change is layout-focused and should not alter board/list/card data models, localStorage schema, or drag-and-drop semantics.

## Goals / Non-Goals

**Goals:**

- Change the list container layout so overflow is handled vertically after the visible list threshold.
- Keep list add/edit/delete, card CRUD, drag-and-drop moves, and persistence behavior unchanged.
- Place the add-list control in the centered empty-state zone when no lists exist.
- Preserve responsive behavior and keyboard-accessible controls.

**Non-Goals:**

- Any changes to storage versioning, workspace model, or migration logic.
- New workspace features or behavioral changes to drag-and-drop rules.
- Visual redesign beyond what is needed for overflow and empty-state action placement.

## Decisions

### 1. Move board list rendering from horizontal strip to wrapped vertical flow

Use a grid/wrapped column layout for list containers so additional lists continue on new rows rather than creating horizontal overflow.

Rationale: This directly addresses the reported problem while keeping each list component unchanged.

Alternative considered: keep horizontal layout and constrain maximum visible lists with pagination. Rejected because it adds navigation complexity and does not meet the explicit vertical-scroll expectation.

### 2. Keep add-list action colocated with empty-state message when list count is zero

Render a dedicated centered add-list form in the empty-state block and render the side/additional list composer only when at least one list exists.

Rationale: The first-call-to-action becomes obvious and aligned with the empty-state text.

Alternative considered: keep one shared add-list control and reposition with absolute CSS. Rejected due to fragility across breakpoints.

### 3. Preserve board mutation and persistence paths

Do not change data helpers, hooks, or storage keys. Reuse existing add-list and update-state handlers from the board component.

Rationale: The issue is presentational, so behavior and persistence should remain stable.

## Risks / Trade-offs

- [Wrapped list layout may affect drag target spacing] → Mitigation: preserve list wrapper drop zones and validate same-list and cross-list drops.
- [Centered empty-state form may duplicate add-list UI logic] → Mitigation: share the same add-list handler and input validation across empty and non-empty variants.
- [Responsive regression on narrow screens] → Mitigation: validate mobile/tablet behavior with list wrapping and control placement.

## Migration Plan

1. Update board shell layout classes to remove forced horizontal scroll and enable wrapped list flow.
2. Add a centered empty-state add-list composer and conditionally render side composer only when lists exist.
3. Validate drag-and-drop, CRUD actions, and persistence after layout changes.

Rollback strategy: revert board layout and empty-state component changes; no data migration or schema rollback is needed.

## Open Questions

- The requirement says “more than 3” lists should avoid horizontal scrolling; implementation will enforce no horizontal scrolling for any list count, which satisfies that threshold.
