# v2 Client-Side FilterBar (Search / Sort / Filter)

**Date:** 2026-07-10
**Status:** Approved design, pending implementation plan

## Goal

Add search, sort, and filter to the v2 Ideas view, performing **all** work
client-side over the already-loaded ideas array. No new network requests — the
motivation is fewer requests and faster interaction. The controls bar is built
as a **generic, config-driven** component reusable across scopes (ideas today;
announcements/reports/etc. later), replacing the v1 MUI `components/FilterBar`
pattern for v2.

## Decisions (from brainstorming)

- **Sort options:** Newest / Oldest (`created`, toggled direction, default = Newest),
  Most comments (`sum_comments`), Most likes (`sum_likes`), Most votes (`sum_votes`).
  Default sort = Newest (`created` / `desc`).
- **Filters:** Author (select, derived from loaded data) and "My ideas" (toggle).
  No status filter.
- **Search fields:** `title`, `content`, `displayname` (case-insensitive substring).
- **State persistence:** URL query params (shareable, back-button friendly,
  survives reload). Defaults omitted from the URL to keep it clean.
- **Layout:** Everything always visible — inline responsive `flex-wrap` row.
- **Architecture:** Generic/config-driven (approach C), because the controls
  will be shared between pages.
- **Component location/name:** `src/v2/components/ui/FilterBar/FilterBar.tsx`
  (PascalCase, matching the other `ui/` components). Distinct from the v1
  `src/components/FilterBar`.

## Architecture

Six units, generic-except-one-config:

### 1. Pure generic logic — `src/v2/utils/collectionControls.ts`

Type-parameterized over `T`, no React. Non-mutating.

```ts
searchItems<T>(items: T[], q: string, fields: (keyof T)[]): T[]
// case-insensitive substring match across `fields`; empty q → passthrough

filterItems<T>(items: T[], activeValues: Record<string, string>, defs: FilterDef<T>[]): T[]
// for each filter id present in activeValues, run its predicate

sortItems<T>(items: T[], sort: SortDef<T> | undefined, dir: 'asc' | 'desc'): T[]
// sort via sort.compare, else via sort.accessor with type-aware comparison
// (string localeCompare, number diff, Date getTime); [...items].sort (stable, non-mutating)
```

### 2. Config types (same file)

```ts
interface SortDef<T> {
  id: string;                         // URL value for ?sort=
  label: string;                      // i18n key; component calls t()
  accessor?: (i: T) => string | number | Date;
  compare?: (a: T, b: T) => number;   // takes precedence over accessor
  defaultDir?: 'asc' | 'desc';
}

interface FilterDef<T> {
  id: string;                         // URL param key
  label: string;                      // i18n key
  kind: 'select' | 'toggle';
  options?: (items: T[]) => SelectOption[];  // dynamic select options (e.g. authors)
  predicate: (item: T, value: string) => boolean;
}

interface ControlsConfig<T> {
  search?: { fields: (keyof T)[]; paramKey?: string };  // paramKey default 'q'
  sorts?: SortDef<T>[];
  filters?: FilterDef<T>[];
  defaultSortId?: string;
}
```

Predicates that need external data (e.g. the current user's hash for "mine") are
**closed over via a config factory** — no context object threaded into the
generic hook.

### 3. Generic hook — `src/v2/hooks/useCollectionControls.ts`

```ts
useCollectionControls<T>(items: T[], config: ControlsConfig<T>): {
  results: T[];                       // memoized search → filter → sort
  state: { q: string; sortId: string; dir: 'asc'|'desc'; filters: Record<string,string> };
  setters: { setQuery; setSort; setDir; setFilter; clearAll };
  resolvedFilters: Array<FilterDef<T> & { selectOptions?: SelectOption[] }>;
}
```

- Owns `useSearchParams` (react-router). URL schema derived from config:
  `q` (or `search.paramKey`), `sort`, `dir`, and one param per filter `id`.
  Toggle active = `'1'`; select = selected value; **defaults omitted** from URL.
- `results` memoized on `[items, q, sortId, dir, filters-signature]`.
- `resolvedFilters` computes each select filter's options once from `items`.
- `sortId` falls back to `config.defaultSortId` (or first sort) when absent;
  `dir` falls back to the sort def's `defaultDir` (or `'desc'`).

### 4. Generic presentational bar — `src/v2/components/ui/FilterBar/FilterBar.tsx`

Renders purely from config + state (no scope-specific knowledge):

- Search: `TextInput` with a search-icon `endAdornment` + clear button (only when
  `config.search` present).
- Sort: `SelectInput` listing `sorts` (only when `sorts` present).
  Newest/Oldest are one `created` sort surfaced as two labels via direction — see
  "Sort/direction modeling" below.
- Filters: one control per `resolvedFilters` entry — `SelectInput` for `select`,
  `Chip`/toggle button for `toggle`.
- A `select` filter auto-hides when its resolved options yield ≤ 1 option
  (handles the single-author room).
- Always-visible responsive `flex-wrap` row. Accessibility comes from the
  underlying v2 inputs.

Props: `{ config, state, setters, resolvedFilters }` (i.e. the hook's return,
minus `results`), plus optional `className`.

### 5. Ideas-specific config — `src/v2/views/private/Room/Ideas/ideasControls.ts`

```ts
getIdeasControls(currentUserHash: string | undefined): ControlsConfig<IdeaType>
```

- **sorts:** `created` (label handling for Newest/Oldest via direction),
  `comments` (`i.sum_comments`), `likes` (`i.sum_likes`), `votes` (`i.sum_votes`),
  all numeric `defaultDir: 'desc'`.
- **filters:**
  - `author` — `kind:'select'`, `options` = unique `{ value: user_hash_id,
    label: displayname }` from items; `predicate: (i, v) => i.user_hash_id === v`.
  - `mine` — `kind:'toggle'`; `predicate: (i) => i.user_hash_id === currentUserHash`
    (closes over `currentUserHash`).
- **search.fields:** `['title', 'content', 'displayname']`.
- **defaultSortId:** `'created'`.

### 6. View wiring — `Ideas.tsx`

- Resolve `currentUserHash = parseJwt(localStorageGet('token'))?.user_hash`.
- `const config = useMemo(() => getIdeasControls(currentUserHash), [currentUserHash])`.
- `const { results, state, setters, resolvedFilters } = useCollectionControls(ideas, config)`.
- Render `<FilterBar config={config} state={state} setters={setters} resolvedFilters={resolvedFilters} />`
  above the list; map over `results`.
- Header count reflects the **filtered** count (`results.length`).
- New distinct empty state: when `ideas.length > 0` but `results.length === 0`,
  show a "no matches for your filters" message with a **clear-filters** action
  (`setters.clearAll`), separate from the existing "room has no ideas" state.

## Sort / direction modeling

Newest and Oldest are the same `created` sort with flipped direction. The sort
`SelectInput` presents user-facing choices; selecting "Oldest" sets
`sort=created&dir=asc`, "Newest" sets `sort=created&dir=desc`. Numeric sorts
(comments/likes/votes) use their `defaultDir` (`desc`). Implementation detail for
the plan: the sort dropdown may either (a) list Newest/Oldest as two entries that
map to one sort id + explicit dir, or (b) list one "Date" entry plus a direction
toggle. **Decision: (a)** — Newest/Oldest as distinct dropdown entries, since the
other sorts are single-direction and a separate direction toggle would be
inconsistent. The dropdown option model therefore maps a display option →
`{ sortId, dir }`.

## URL param examples

- `?q=budget` — search "budget".
- `?sort=likes` — most likes (dir defaults to `desc`).
- `?sort=created&dir=asc` — oldest first.
- `?author=<hash>` — only that author.
- `?mine=1` — only current user's ideas.
- Combined: `?q=park&sort=comments&mine=1`.

## Edge cases

- **No current user hash** (JWT missing/unparseable): "mine" toggle predicate
  matches nothing; acceptable (control still renders; yields empty → "no matches"
  state with clear action).
- **Single author:** author select auto-hidden.
- **Empty search / no active filters:** passthrough, original order by default sort.
- **Scroll restoration:** stays keyed by room only (`ideas-${room_id}`).
  Filtering changes the visible list, so we do not attempt to preserve scroll per
  filter combination. Flagged as a known, accepted limitation.

## Testing (TDD)

- **Pure functions** (`collectionControls.ts`): `searchItems`, `filterItems`,
  `sortItems` — unit tests over sample `IdeaType[]` incl. empty/edge inputs and
  non-mutation assertions.
- **Ideas config** (`ideasControls.ts`): author option derivation (uniqueness),
  `mine` predicate with/without `currentUserHash`, sort accessors.
- **Hook** (`useCollectionControls`): `renderHook` under `MemoryRouter` —
  URL read/write, default fallbacks, defaults omitted from URL, memoized pipeline
  ordering (search → filter → sort).

## Out of scope

- No server-side query params / API changes.
- No generalizing v1 `components/FilterBar` or other v2 scopes in this pass —
  only the reusable pieces are built; the second consumer is a future task.
- No persistence beyond URL (no localStorage).
