"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var rule = require("../../../lib/rules/no-own-index-imports"),
    RuleTester = require("eslint").RuleTester;

const {createTest} = require("../../_utils");

const test = createTest({
    htg: {
        path: {
            '@modules/': 'src/modules/'
        },
        modules: [
            '@modules/libs',
        ]
    }
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-own-index-imports", rule, {

    valid: [
        test({
            code: "import { fn } from './OtherFile'",
            filename: "@modules/libs/someModule/SomeFile.js",
        }),
        test({
            code: "import { fn } from '@modules/libs/otherModule'",
            filename: "@modules/libs/someModule/SomeFile.js",
        }),
        test({
            code: "import { fn } from '@modules/libs/otherModule/index'",
            filename: "@modules/libs/someModule/SomeFile.js",
        }),
    ],

    invalid: [
        test({
            code: "import { fn } from '.'",
            filename: "@modules/libs/someModule/SomeFile.js",
            errors: [{
                message: "HTG: importing from module\'s own index file. Convert to a relative import.",
                type: "Literal"
            }]
        }),
        test({
            code: "import { fn } from './'",
            filename: "@modules/libs/someModule/SomeFile.js",
            errors: [{
                message: "HTG: importing from module\'s own index file. Convert to a relative import.",
                type: "Literal"
            }]
        }),
        test({
            code: "import { fn } from './index'",
            filename: "@modules/libs/someModule/SomeFile.js",
            errors: [{
                message: "HTG: importing from module\'s own index file. Convert to a relative import.",
                type: "Literal"
            }]
        })
    ]
});
