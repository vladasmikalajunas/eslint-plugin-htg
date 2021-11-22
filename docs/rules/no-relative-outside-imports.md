# Disallow relative imports from the outside of module (no-relative-outside-imports)

This rule prevents importing files via relative path from outside of module. Global imports should be used instead.


## Rule Details

This rule aims to...

Examples of **incorrect** code for this rule:

```js
// file path: modules/myModule/file.js
import { Something } from '../otherModule';

```

Examples of **correct** code for this rule:

```js
// file path: modules/myModule/file.js
import { Something } from '@modules/otherModule';

```
