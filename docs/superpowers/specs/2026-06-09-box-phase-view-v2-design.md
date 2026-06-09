# BoxPhase View v2 — Data Fetching Design

## Scope

Migrate the `BoxPhaseView` (route `/room/:room_id/phase/:phase`, specifically phase 10) from v1 to v2. This spec covers the data fetching and state management architecture only. UI component migration (BoxCard, BoxForms) is out of scope — BoxForms remains as the v1 MUI version for now.

---

## Architecture

Two co-located hooks handle all logic. The view component is a pure layout shell with no data logic.

### `useBoxesData(room_id, phase)`

**Responsibility:** fetch, loading/error state, search/sort/filter, breadcrumb.

**Returns:**
```ts
interface UseBoxesDataReturn {
  boxes: BoxType[];          // raw, unfiltered
  sortedBoxes: BoxType[];    // filtered + sorted, ready to render
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  scopeHeaderProps: object;  // passed directly to ScopeHeader
}
```

**Internals:**
- `useState` for `boxes`, `isLoading`, `error`
- `useCallback` for `fetchBoxes` — calls `getBoxesByPhase(phase_id, room_id)` and `getRoom(room_id)` for breadcrumb
- Breadcrumb dispatched via `useAppStore` after fetch resolves (same as v1)
- Search/sort via existing `useSearchAndSort` + `useFilter` hooks
- `sortedBoxes` is memoized with `useMemo`

---

### `useBoxEdit(refetch)`

**Responsibility:** open add/edit form via global modal, delete a box, trigger refetch on close.

**Returns:**
```ts
interface UseBoxEditReturn {
  onEdit: (box: BoxType) => void;
  onAdd: () => void;
  onDelete: (id: string) => Promise<void>;
}
```

**Internals:**
- Uses `useModal` (`openModal`, `closeModal`) from `src/v2/hooks/useModal`
- `onAdd` → `openModal(t('...'), <BoxForms onClose={handleClose} />)`
- `onEdit(box)` → `openModal(t('...'), <BoxForms defaultValues={box} onClose={handleClose} />)`
- `handleClose` → `closeModal()` then `refetch()`
- `onDelete(id)` → calls `deleteBox(id)` then `refetch()`
- No local open/close state — the global `ModalRoot` (already in `Layout.tsx`) owns that

---

## View Component

```tsx
const BoxPhaseView = () => {
  const { room_id, phase } = useParams();
  const { sortedBoxes, isLoading, error, refetch, scopeHeaderProps } = useBoxesData(room_id!, phase!);
  const { onEdit, onAdd, onDelete } = useBoxEdit(refetch);

  if (isLoading) return <BoxPhaseViewSkeleton />;

  return (
    <div className="...">
      <ScopeHeader {...scopeHeaderProps} />
      <div className="grid ...">
        {sortedBoxes.length === 0
          ? <EmptyState />
          : sortedBoxes.map(box => (
              <BoxCard key={box.hash_id} box={box} onEdit={() => onEdit(box)} onDelete={() => onDelete(box.hash_id)} />
            ))
        }
      </div>
      {checkPermissions('boxes', 'create') && Number(phase) === 10 && (
        <AddButton onClick={onAdd} />
      )}
    </div>
  );
};
```

No drawer, no local edit state, no MUI imports in the view.

---

## File Structure

```
src/v2/views/private/BoxPhase/
  index.tsx                  ← route export
  BoxPhaseView.tsx           ← layout shell
  BoxPhaseViewSkeleton.tsx   ← loading state component
  useBoxesData.ts
  useBoxEdit.ts
```

v1 BoxForms is reused as-is inside `useBoxEdit` via `openModal`.

---

## What is NOT changing

- `src/services/boxes.ts` — service layer untouched
- `BoxForms` — stays as v1 MUI component, passed into the global modal
- Route registration in `PrivateRoutes.tsx` — updated to point to v2 component but route path unchanged
- `useSearchAndSort`, `useFilter` — reused from existing hooks

---

## Key constraints

- No prop drilling — `BoxCard` and `BoxForms` receive only what they need in a single pass
- No new state management libraries — plain React hooks + existing Context
- Tailwind-only for new components (`BoxPhaseView`, `BoxPhaseViewSkeleton`) — no MUI
- `BoxForms` modal integration uses the existing global `ModalRoot` already mounted in `Layout.tsx`
