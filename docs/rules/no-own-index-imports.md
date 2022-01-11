# Disallow imports from module's own index file (no-own-index-imports)

This rule prevents modules importing from their own index file because such imports create circular references. Relative imports should be used instead.

## Rule Details

Examples of **incorrect** code for this rule:

```js

// File: @modules/commons/my-module
import { Something } from '.';

```

Examples of **correct** code for this rule:

```js

// File: @modules/commons/my-module
import { Something } from './Something';

```