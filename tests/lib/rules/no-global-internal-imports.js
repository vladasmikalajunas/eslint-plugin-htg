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

const {createTest} = require("../utils");

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
                type: "ImportDeclaration"
            }]
        }),
        test({ // Exporting local file via global path
            code: "export { fn } from '@modules/commons/module/utils.js'",
            filename: "@modules/commons/module/index.js",
            errors: [{
                message: "HTG: Exporting local dependency via global path.",
                type: "ExportNamedDeclaration"
            }]
        }),
        test({ // Importing local file via global path
            code: "import { fn } from '@modules/commons/module'",
            filename: "@modules/commons/module/SomeFile.js",
            errors: [{
                message: "HTG: Importing local dependency via global path.",
                type: "ImportDeclaration"
            }]
        }),
    ]
});
