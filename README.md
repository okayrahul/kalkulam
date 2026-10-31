# Kalkulam family atlas

[Explore the live family tree](https://okayrahul.github.io/kalkulam/).

The archive contains **509 people across seven generations**: the founding couple, eleven branches, and the Arumanai family of K. Vishwanathan Thampi and Anandavalli Amma, the Poojapura family of Thanuvan Thampi and Lekshmi Kunjamma, and the Poovangaparambu family of K. Sukumaran Thampi and L. K. Saraswathi, the Kodavilakom family descending through V. Kamalamma Thankachi, and the Arappura family of V. Sharada Thankachy and R. Madhavan Pillai.

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

Saritha is the only supplied parent of Aadhithya and Advaith. No partner is assumed. The user finalized Anandavalli Amma as the displayed name; Ananda Valliyamma remains a searchable earlier label. Valliyamma follows the founding diagram, with Viliyamma retained as a search alias. Kamalamma's alternate name Parvathi Pilla Thankachi is also retained.

Branch numbers and sibling order reflect source presentation, not confirmed birth order. Empty child lists mean descendants have not yet been recorded. Deceased status is recorded only where a supplied diagram explicitly says “late.” No dates or other family relationships are inferred.

## Validation

`node --test` covers the eleven founding branches, source-specific parent assignments, reciprocal marriages, six-generation ancestry paths, descendant and spouse search, missing references and cycles, expanding and collapsing branches, non-overlapping layout, child-connector targets, and the layout budget. Desktop and mobile browser QA covers branch navigation, expansion, search, person details, zoom, and deep links.

## Poojapura and Poovangaparambu additions

The two new diagrams add **63 people**, bringing the archive to 149 records: 143 named people and six unnamed relatives with explicit relationships. Thanuvan’s branch adds 55 people (35 descendants and 20 spouses); Sukumaran’s branch adds eight (six descendants and two spouses). The supplied portraits of Thanuvan and Lekshmi Kunjamma are extracted into `assets/` and retained without synthetic enhancement. `npm run build` includes them.

The user confirmed **Thanuvan Thampi** and **Lekshmi Kunjamma** as the correct names. Their existing IDs remain stable, and the earlier labels Tanuvan Thampi and Lekshmi Kutty remain searchable.

**Resolved source discrepancy:** an earlier Poovangaparambu diagram said K. Sumaran Thampi. The later supplied Poovangaparambu 10.pdf explicitly confirms K. Sukumaran Thampi (Gopi Thampi). The spelling warning is removed; the earlier label remains a search alias and correction provenance records the resolution.

**Initially omitted pending clarification:** Dr. Renju was unconnected in the earlier diagram. The later supplied Poovangaparambu 10.pdf explicitly identifies Dr. P. Renju as the wife of Dr. S. Praveen Kumar, so the record and marriage have now been added. The connector from Dr. Suresh Kumar and Sreelatha identifies Dr. Praveen Kumar and Ayappadas as children. Syamala Kumari and Dr. Ramankutty have Ratheesh and Dr. Rajesh.

**Unnamed records:** Devi’s spouse, Rohith’s spouse, Kalyani’s spouse, Manoj and Beth’s unnamed daughter, and two unnamed sons of Shankar and Anita. These six records have distinct stable IDs and explicit placeholder labels, not invented names or birth order. The spouses and children are attached only to the families shown.

**Repeated names:** Gopinathan Nair in the Ambika family remains separate from the Gopinathan Nair married to Sreekumari in the Arumanai branch. The two Anitas, two Adityas, and Gayatri/Gayathri also have separate records. Search now displays parents or partners to distinguish them. No cross-branch identity merges are assumed. Employment, education, residence, and student descriptions are retained as source notes, not verified current statuses.

## Kodavilakom PDF addition

The 37-page supplied PDF contributes **98 new people**: Bhanumathy Thankachi (also recorded as Bhagavathy Pilla Thankachi), her spouse Bhaskaran Nair, and all 96 numbered member-detail entries. These join the existing V. Kamalamma Thankachi and Velayudhan Thampi family. No duplicate records are created for the original roots or Kamalamma’s couple. Her subtree now contains 100 people including the existing couple, and 64 descendants; the archive has 247 people, of whom six still have the unnamed placeholder records from the earlier diagrams.

The ten generation-four families are children of Bhanumathy and Bhaskaran Nair. The PDF supplies two generation-seven children, Adharv and Aditya, under Arunlal and Renjitha. Each imported member stores the PDF page, numbered entry, stated family, and original relationship wording for provenance. Same-name people are not merged across branches or households. In particular, the Sreekalas married to Vinod and Pradeep are separate records, and B. Velayudhan Thampi (generation four) is not his generation-two ancestor Velayudhan Thampi.

“Optional Member Details” means voluntary blank contact and biographical fields. It does not exclude the named people or relationships. All connected entries are imported; blank contact, address, education, occupation, and date fields are not converted into values.

**User-confirmed correction:** Family 04 page 6 pairs Sunitha with Harikumar, and their son Vivek Krishnan’s entry confirms this. Harikumar’s numbered entry 44 on page 23 mistakenly says Family 05 and spouse of Dr Deepthi K. S. The user explicitly finalized **Sunitha + Harikumar** and **Dr. Deepthi K. S. + S. Sreekumar**. These final couples are recorded without an unresolved warning, and the superseded PDF text is retained in correction provenance.

**Confirmed no children:** Family 03 explicitly states that B. Karthiyani Pillai Thankachi (Remani) and Balakrishnan Nair had no children. Their union has `childrenStatus: confirmed-none`. The tree and profiles show this explicitly, while other empty descendant lists continue to mean not yet recorded.


## Arappura address book addition

The supplied 12-page scanned Arappura-2026 PDF adds **161 people** and **57 unions** to the existing Sharada founding branch. The archive now contains **408 people** across seven generations. Sharada and R. Madhavan Pillai have thirteen recorded children (ten daughters and three sons). The branch contains 162 people including the existing Sharada record. All names, honorifics, deceased labels, occupations, education notes, and **104 mobile entries** are transcribed from the complete rendered pages. Pages that continue a person or household onto the next page are kept connected (Archana/Viplab, Radha, Gopika/Sajilal, Aadityakumar's son Saathvik, and Ramadas's children). Each new record retains its PDF page and numbered family for provenance.

The user corrected the existing name to **V. Sharada Thankachy**, using the PDF's surname spelling, and **Anandavalli Amma** as Viswanathan Thampi's wife. Existing IDs and incoming links remain stable; prior labels are search aliases. Sarada P Nair in Family 1 remains spelled Sarada, exactly as the new PDF prints her distinct name.

Phone numbers appear only on expanded profiles as tap-to-call links. Display strings retain the source's spaces, plus signs, and leading zeros; no country codes or missing values are guessed. The PDF repeats the same number for Sabarinath/Arathi, Akshay/Sanjana, and five members of the Parulekar household; those repeated values are preserved. Jayalakshmi and Madhavan Nair have similar but different numbers, 9946356709 and 9846356709 respectively, and are not conflated. Occupation/student descriptions are dated source information, not assertions about current employment. The supplied founder portraits are cropped faithfully into assets.


## Sarojini / Lekshmi Nilayam diagram addition

The supplied Sarojini diagram adds **30 people** (18 descendants and 12 spouses) beneath the existing V. Sarojini Thankachi and L. K. Krishnan Nair couple. The four children are Rema Devi S., Hema Vijayakumar, Prema S, and Dr. Sarojini Sudha. The branch now includes 32 people across generations two through five, bringing the full archive to **438 people** and 156 family unions.

Children are assigned according to the descending arrows; marriage arrows identify spouses. In particular, Harikumar A and Archana Shankar are Rema Devi's children; Girish Thampy and Vignesh Thampy are Hema's children; Athira S. and Chithira S. are Dr. Sarojini Sudha's children. Karan and Nirbhay are children of Archana and Col. Shankar Gopinath; Peyasha is Karan's spouse. Sanjana Nair is the child of Harikumar and Parvathi, married to Srinath Nair. Prema and Ramachandran Nair have no descendants supplied in this diagram; this does not imply confirmed childlessness.

Source spellings including Thampy, Peyasha, Amarys Praveen, and Harikumar A are preserved. No family member is merged with a similarly named person in an earlier branch. No phone numbers or deceased statuses are supplied by this diagram.


## October 31 PDF updates

Poovangaparambu 10.pdf enriches the existing Sukumaran branch without duplicating any of its ten earlier people. Full names, initials, titles, Gopi Thampi's alias, Manipal/Nagercoil places, occupations and the founder's former Legislative Council membership are retained. Eight new records add Dr. M. Sunitha, Dr. P. Renju, Dr. C. Lakshmi, Siddarth, Kalidas, Adv. R. Ananthesh, P.R. Gayatri and A.L. Sai Arjun. The branch now contains 18 people and reaches generation five. Rathish and Ayyappadas follow the new PDF's spelling; earlier labels remain searchable. Rathish has two explicitly recorded children with no spouse supplied, so no spouse is invented. The existing Sarojini/Arappura phone data remains unchanged; neither new PDF supplies phone numbers. Four individual portraits are extracted faithfully from the two supplied couple photographs, including the founding ancestors.

DOC-20261031-WA0019.pdf connects the Kulashekaram family to the existing Omana Thankachi founding branch. It adds 63 people and 22 unions, including Omana's husband Madhavan Pillai and their seven children: Vijayamma Thankachi, Narayanan Thampi, Leela Thankachi, Padma Nair, Vasantha Nair, Mohan Kumar and Usha Nair. The complete Omana branch has 64 people, including spouses, through generation six. Its 42 descendants plus Omana account for the source's headline count of 43; that caption excludes spouses and the ancestors rather than representing every box. Beena has no supplied descendants or spouse. Anupama's two children, Aryan and Abhay, remain a single-parent family because no spouse is shown.

The two new Krishna Kumar records are distinct: Rajasree Bhaskar's spouse and Narayanan Thampi's child married to Saritha. Omana's husband Madhavan Pillai is not Sharada's husband R. Madhavan Pillai. Other repeated names also retain distinct IDs and explicit relationships. All imported Kulashekaram records retain page and relationship provenance, and all Poovangaparambu updates retain the corresponding source page. Existing branch/person links remain stable.

These imports add 71 people in total, bringing the archive to **509 people and 182 unions across seven generations**.

The homepage uses a transparent sibling version of the Family Forum artwork with restrained gilded relief and a CSS drop shadow. The original supplied artwork is preserved in assets/kalkulam-family-forum.png; the displayed version is assets/kalkulam-family-crest.png. It was edited with the built-in image generator, and its actual alpha channel is retained. Desktop and 390px mobile previews confirm that the crest has no white image panel or horizontal overflow.
