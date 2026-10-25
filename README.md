# Kalkulam family atlas

[Explore the live family tree](https://okayrahul.github.io/kalkulam/).

The archive contains **149 people across six generations**: the founding couple, eleven branches, and the Arumanai family of K. Vishwanathan Thampi and Ananda Valliyamma, the Poojapura family of Thanuvan Thampi and Lekshmi Kunjamma, and the Poovangaparambu family of K. Sukumaran Thampi and L. K. Saraswathi.

## Explore

The primary view is a connected family flowchart. A double-ended arrow joins spouses; a descending line lands on the actual child. Open a family's `+` control to reveal its children without replacing the surrounding tree. Use the focus control to explore one family, breadcrumbs to return to ancestors, and the overview map to navigate large branches. `Show whole branch` opens all recorded descendants in the current branch.

Drag to pan, pinch to zoom on touch screens, or use Ctrl + wheel to zoom. When the canvas is focused, arrow keys pan, `+` / `-` zoom, and `Home` restores a readable view. The full-screen control provides more room. Search locates any recorded person, including later generations and spouses, and opens the ancestral path to them. Press `/` to jump to search.

Shareable person links use `#person=ID`. Tree links use `#tree=ID&focus=ID` to reopen a branch and locate a person. Unknown links safely fall back to the founding tree.

## Run and publish

Requires Node.js 22 or newer. No package installation is required.

```
npm run dev
npm test
npm run build
```

Open http://localhost:4173. The optional build copies static assets into `dist/`. GitHub Pages serves the repository root on `main`; every update to `main` publishes automatically. `.nojekyll` disables Jekyll processing, and relative asset paths support the repository's Pages URL.

## Add records

Edit `src/family.js`. Each person has a stable unique ID, name, and generation, with optional aliases, place, notes, and deceased status. Families explicitly list parent/partner IDs and child IDs. Single-parent records are supported; no spouse is invented when one is absent from a source.

Add the person to `people`, add their ID to the correct family's `children`, and add another family record when their own spouse or children are known. Run `npm test` before publishing. The eleven founding branch IDs stay stable so later generations remain connected to their original branch.

Names, parents, and marriages are distinct. For example, `sreekumari` is Vishwanathan's daughter married to Gopinathan Nair; `sreekumariAjith` is Dr. Sreekumari Ajith Kumar, married to Ajith Kumar Padmanabhan Nair. These are separate people.

## Rendering and growth

`src/tree-layout.js` measures expanded subtrees and assigns non-overlapping positions to couples. Collapsed descendants do not enter the layout. The DOM renders only nodes near the viewport; offscreen cards are removed while a small overview map preserves the complete visible-tree context. An explicit 1,200-family layout budget prevents runaway expansions and prompts the visitor to focus a smaller branch. The camera preserves the expanded family's screen position, and search can reveal deep ancestors without opening every sibling subtree.

Relationship indexes avoid repeatedly scanning all families. The data validator catches missing references, duplicate children, duplicate family IDs, and ancestry cycles. Records are currently a small static module. For a substantially larger archive, the next data step is per-branch loading and a compact search index; the rendering already supports bounded exploration. There is no backend or visitor-data storage.

## Transcription notes

The initial eight diagrams identify the founding couple and eleven branches. The additional Vishwanathan/Arumanai diagram adds **67 people**, including **44 direct descendants and 23 spouses**, through generation six. Its six first children are Chandrika, Sreekumari, Harikumaran Thampi, Geetha Kumari, Gopakumaran Thampi, and V. Satheesh Kumar. K. Padmanabhan Nair, Gopinathan Nair, and Vijayakumar are spouses, not children of Vishwanathan.

Saritha is the only supplied parent of Aadhithya and Advaith. No partner is assumed. The source's Anandavalli Amma spelling is retained as an alias of the existing Ananda Valliyamma record. Valliyamma follows the founding diagram, with Viliyamma retained as a search alias. Kamalamma's alternate name Parvathi Pilla Thankachi is also retained.

Branch numbers and sibling order reflect source presentation, not confirmed birth order. Empty child lists mean descendants have not yet been recorded. Deceased status is recorded only where a supplied diagram explicitly says “late.” No dates or other family relationships are inferred.

## Validation

`node --test` covers the eleven founding branches, source-specific parent assignments, reciprocal marriages, six-generation ancestry paths, descendant and spouse search, missing references and cycles, expanding and collapsing branches, non-overlapping layout, child-connector targets, and the layout budget. Desktop and mobile browser QA covers branch navigation, expansion, search, person details, zoom, and deep links.

## Poojapura and Poovangaparambu additions

The two new diagrams add **63 people**, bringing the archive to 149 records: 143 named people and six unnamed relatives with explicit relationships. Thanuvan’s branch adds 55 people (35 descendants and 20 spouses); Sukumaran’s branch adds eight (six descendants and two spouses). The supplied portraits of Thanuvan and Lekshmi Kunjamma are extracted into `assets/` and retained without synthetic enhancement. `npm run build` includes them.

The user confirmed **Thanuvan Thampi** and **Lekshmi Kunjamma** as the correct names. Their existing IDs remain stable, and the earlier labels Tanuvan Thampi and Lekshmi Kutty remain searchable.

**Source discrepancy:** the new Poovangaparambu diagram says K. Sumaran Thampi, while the earlier source says K. Sukumaran Thampi. Place and spouse agree. The earlier displayed spelling is retained, the new spelling is searchable, and the profile explicitly flags the unresolved spelling.

**Omitted by user instruction:** Dr. Renju is an unconnected box in the supplied image. No person or marriage record has been added for Renju pending clarification. The connector from Dr. Suresh Kumar and Sreelatha identifies Dr. Praveen Kumar and Ayappadas as children. Syamala Kumari and Dr. Ramankutty have Ratheesh and Dr. Rajesh.

**Unnamed records:** Devi’s spouse, Rohith’s spouse, Kalyani’s spouse, Manoj and Beth’s unnamed daughter, and two unnamed sons of Shankar and Anita. These six records have distinct stable IDs and explicit placeholder labels, not invented names or birth order. The spouses and children are attached only to the families shown.

**Repeated names:** Gopinathan Nair in the Ambika family remains separate from the Gopinathan Nair married to Sreekumari in the Arumanai branch. The two Anitas, two Adityas, and Gayatri/Gayathri also have separate records. Search now displays parents or partners to distinguish them. No cross-branch identity merges are assumed. Employment, education, residence, and student descriptions are retained as source notes, not verified current statuses.
