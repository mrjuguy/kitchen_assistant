# Test Plan: Household Management & Collaborative Inventory

**Objective**: Validate the secure migration to a household-based architecture and ensure real-time collaboration workflows function correctly between multiple users.

**Prerequisites**:
- Two distinct Supabase accounts/Users (Device A & Device B).
    - *User A*: Existing user with data.
    - *User B*: Clean/New user (or secondary existing user).

## 1. Migration Verification (Regression)
**Goal**: Ensure existing users lost no data during the architectural shift.

| Step | Action | Expected Result |
| :--- | :--- | :--- |
| 1.1 | Log in as **User A**. | App loads successfully without errors. | Pass
| 1.2 | Navigate to **Pantry**. | All previous items are visible. | Pass
| 1.3 | Navigate to **Recipes**. | All created recipes are visible. | Pass
| 1.4 | Navigate to **Profile** > **Household**. | Screen loads. "My Household" is displayed with a generated **Invite Code**. | Pass

## 2. Multi-User Collaboration (The "Invite" Flow)
**Goal**: Verify multiple users can join a household and share state.

| Step | Action | Expected Result |
| :--- | :--- | :--- |
| 2.1 | On **User A** (Owner), go to **Profile** > **Household**. | Copy the **Invite Code**. | Pass
| 2.2 | Log in as **User B** on a different device/simulator. | **Note**: If User B is new, they may see an empty state/error initially (Known Gap: Default household creation). | Pass
| 2.3 | On **User B**, go to **Profile** > **Household**. | Paste User A's **Invite Code** into "Join Another Household" and tap **+**. | Pass
| 2.4 | **User B**: Wait for success alert. | Alert "Success: You have joined the household!". | Pass
| 2.5 | **User B**: Refresh/View Household screen. | **User A** appears in the member list. Current Household updates to "My Household" (User A's household name). | Fail, No users appear in the household list. 
| 2.6 | **User B**: Navigate to **Pantry**. | **User B** now sees **User A's** pantry items. | Pass

## 3. Real-Time Data Sync & Permissions
**Goal**: Verify that actions taken by one member are reflected for others.

| Step | Action | Expected Result |
| :--- | :--- | :--- |
| 3.1 | **User B**: Add a new item "Test Milk" to **Pantry**. | Item appears in User B's list. | Pass
| 3.2 | **User A**: Pull-to-refresh **Pantry**. | "Test Milk" appears in **User A's** list. | Pass
| 3.3 | **User A**: Add "Shared Pasta" to **Shopping List**. | Item appears in User A's list. | Pass
| 3.4 | **User B**: Navigate to **Shopping List**. | "Shared Pasta" is visible. | Pass
| 3.5 | **User B**: Mark "Shared Pasta" as bought and Checkout. | Item moves to Pantry for **BOTH** users. Shopping list clears for **BOTH**. | Pass

## 4. Security & Isolation
**Goal**: Ensure data does not leak between unconnected households.

| Step | Action | Expected Result |
| :--- | :--- | :--- |
| 4.1 | Create a third account **User C** (or use a simulator). | User C logs in. | Pass
| 4.2 | **User C** checks Pantry. | Should NOT see "Test Milk" or "Shared Pasta". | Pass
| 4.3 | **User C** attempts to join with an invalid code. | Error: "Invalid invite code". | Pass

## 5. Edge Cases & Known Limitations
- **New User Sign-Up**: Currently, new users require a trigger to create a default household. If User B is brand new, they must be invited to a household or the system must be patched to auto-create one.
- **Switching Households**: The UI primarily supports "Joining" (which makes the new household active). "Switching" back to an old household requires re-joining or future UI work.

## 6. Cleanup
- Remove "Test Milk" and "Shared Pasta" to restore clean state.
- (Optional) User B can be removed from household via database if needed for re-testing.
