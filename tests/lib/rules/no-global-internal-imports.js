"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const path = require('path');

function testFilePath(relativePath) {
    return path.join(process.cwd(), './tests/files', relativePath)
}

var rule = require("../../../lib/rules/no-global-internal-imports"),
    RuleTester = require("eslint").RuleTester;

const {createTest} = require("../../_utils");

const settings = {
    htg: {
        path: {
            '@modules/': 'src/modules/'
        },
        modules: [
            '@modules/commons',
            '@modules/models',
            '@modules/components',
            '@modules/features',
            '@modules/pages',
        ]
    }
};

const test = createTest(settings);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-global-internal-imports", rule, {

    valid: [
        test({ // Import into another module from public interface
            code: "import { fn } from '@modules/commons/module'",
            filename: "@modules/commons/anotherModule/SomeFile.js",
        }),
        test({ // Import from simple file
            code: "import { fn } from '@modules/commons/module'",
            filename: "simpleFile.js",
        }),
        test({ // Import rellative file in same module
            code: "import { fn } from './utils.js'",
            filename: "@modules/commons/module/SomeFile.js",
        }),
        test({ // exporting a variable value
            code: "export const variable = 'value'",
            filename: "@modules/commons/module/SomeFile.js",
        }),
    ],

    invalid: [
        test({ // Importing local file via global path
            code: "import { fn } from '@modules/commons/module/utils.js'",
            filename: "@modules/commons/module/SomeFile.js",
            errors: [{
                message: "HTG: Importing local dependency via global path.",
                type: "Literal"
            }],
            output: "import { fn } from './utils.js'",
        }),
        test({ // Importing local deeply nested file via global path
            code: "import { fn } from '@modules/commons/module/a/b/c/utils.js'",
            filename: "@modules/commons/module/SomeFile.js",
            errors: [{
                message: "HTG: Importing local dependency via global path.",
                type: "Literal"
            }],
            output: "import { fn } from './a/b/c/utils.js'",
        }),
        test({ // Importing local file from deeply nested local file via global path
            code: "import { fn } from '@modules/commons/module/rootfile.js'",
            filename: "@modules/commons/module/subfolder/subfile.js",
            errors: [{
                message: "HTG: Importing local dependency via global path.",
                type: "Literal"
            }],
            output: "import { fn } from '../rootfile.js'",
        }),
        test({ // Importing local deeply nested file from another deeply nested local file via global path
            code: "import { fn } from '@modules/commons/module/subfolder/subfile1.js'",
            filename: "@modules/commons/module/subfolder/subfile2.js",
            errors: [{
                message: "HTG: Importing local dependency via global path.",
                type: "Literal"
            }],
            output: "import { fn } from './subfile1.js'",
        }),
        test({ // Exporting local file via global path
            code: "export { fn } from '@modules/commons/module/utils.js'",
            filename: "@modules/commons/module/index.js",
            errors: [{
                message: "HTG: Exporting local dependency via global path.",
                type: "Literal"
            }],
            output: "export { fn } from './utils.js'"
        }),
        test({ // Importing local file via global public file
            code: "import { fn } from '@modules/commons/module'",
            filename: "@modules/commons/module/SomeFile.js",
            errors: [{
                message: "HTG: Importing local dependency via global path.",
                type: "Literal"
            }]
        }),
    ]
});
