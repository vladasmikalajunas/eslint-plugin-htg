"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const path = require('path');

function testFilePath(relativePath) {
    return path.join(process.cwd(), './tests/files', relativePath)
}

var rule = require("../../../lib/rules/no-relative-outside-imports"),
    RuleTester = require("eslint").RuleTester;

const {createTest} = require("../../_utils");

const settings = {
    htg: {
        path: {
            '@modules/': 'src/modules/'
        },
        modules: [
            '@modules/libs',
            '@modules/features',
        ]
    }
};

const test = createTest(settings);

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-relative-outside-imports", rule, {

    valid: [
        test({ // Import into another module from public interface
            code: "import { fn } from '@modules/libs/module'",
            filename: "@modules/libs/anotherModule/SomeFile.js",
        }),
        test({ // Import from simple file
            code: "import { fn } from '@modules/libs/module'",
            filename: "simpleFile.js",
        }),
        test({ // Import relative file in same module
            code: "import { fn } from './utils.js'",
            filename: "@modules/libs/module/SomeFile.js",
        }),
    ],

    invalid: [
        test({ // Reaching out of module with relative path
            code: "import { fn } from '../someFile'",
            filename: "@modules/libs/module/SomeFile.js",
            errors: [{
                message: "HTG: Reaching out of module with relative path.",
                type: "Literal"
            }]
        }),
    ]
});
