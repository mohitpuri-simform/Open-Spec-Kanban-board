## 1. Board Layout Overflow Fix

- [ ] 1.1 Update the board list container layout to remove horizontal scrolling and render additional lists using wrapped/vertical flow.
- [ ] 1.2 Keep list wrapper drop targets intact and verify drag-over/drop styling still works after layout changes.

## 2. Empty-State Add-List Placement

- [ ] 2.1 Add a centered add-list composer inside the empty-state region shown when the workspace has zero lists.
- [ ] 2.2 Reuse existing add-list validation and creation handlers so empty-state and non-empty-state controls behave consistently.

## 3. Regression Verification

- [ ] 3.1 Verify list/card CRUD and drag-and-drop still work after layout updates.
- [ ] 3.2 Verify localStorage persistence still restores data after reload.
- [ ] 3.3 Verify responsive behavior for wrapped lists and centered empty-state controls on desktop and mobile widths.
