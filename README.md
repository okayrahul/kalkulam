# Kalkulam family atlas

A responsive family archive beginning with Kalkulam T. Kumarapilla and Valliyamma Pilla Thankachi, their eleven children, and the six spouses shown in the supplied family diagrams.

## Run locally

Requires Node.js 22 or newer. No dependencies or install step.

```
npm run dev
npm test
npm run build
```

Open http://127.0.0.1:4173. Build copies deployable assets into `dist/`; GitHub Pages serves the same static files directly from the repository root on `main`. `.nojekyll` disables Jekyll processing. Relative asset paths support GitHub project URLs.

## Add generations

Edit `src/family.js`. Give every person a stable unique ID in `people`. Add a family entry with its `partners` and `children` IDs. A person can participate in multiple unions; parents and spouses remain separate. Set generation, aliases, place, and notes only from confirmed records. Run `npm test` before committing. Every commit to `main` is published by GitHub Pages.

```
people.newPerson = {name: 'Confirmed name', generation: 3};
// Add 'newPerson' to the relevant family's children array.
// Add another union when this person has a recorded partner or children.
```

The archive validates references, duplicate children, and ancestry cycles. Relationship indexes avoid repeatedly scanning all families. Branch navigation renders the immediate family of a selected person, so deeper generations do not all load into the tree canvas at once. Search covers people, aliases, notes, and places. Person links use `#person=ID` and work without a server router.

The eleven founding branches are the initial directory. As the archive grows substantially, move records into per-branch JSON chunks, load the selected branch on demand, add a compact search index, and paginate large immediate families. Current canvas rendering is bounded by generation, not by number of siblings; extreme sibling counts will require viewport virtualization. The app has no backend and stores no visitor data.

## Source and transcription

Only the relationships supplied in the eight original diagrams are recorded. The spouse arrow means marriage; descending arrows identify children. The branch order follows the supplied images and is **not confirmed birth order**. Empty child lists mean descendants have not yet been entered, not that there were no children. Spouses without supplied parents are not assigned the founders as parents. Only Kamalamma and Velayudhan are marked deceased because the source explicitly says “late.”

The founder spelling Valliyamma follows the diagram; Viliyamma is preserved as a searchable alternate spelling from the request. Kamalamma's alternate name Parvathi Pilla Thankachi is preserved. No dates or descendants have been invented.

GitHub Pages publishes the recorded family information publicly. Add only information intended for that public archive. For any future living-person records, decide the family's publication policy before adding personal details.

## Verification

`node --test` checks all eleven branches, reciprocal marriages, search by spouse and alias, missing references, cycles, and adding a third generation. The interface supports keyboard navigation, labeled dialogs, reduced motion, responsive cards, native modal focus handling, and keyboard canvas pan/zoom.
