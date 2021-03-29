"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const path = require('path');

function testFilePath(relativePath) {
    return path.join(process.cwd(), './tests/files', relativePath)
}

var rule = require("../../../lib/rules/no-deep-module-imports"),

    RuleTester = require("eslint").RuleTester;

const settings = {
    htg: {
        path: {
            '@v2/': 'client/v2/'
        },
        modules: [
            '@v2/commons',
            '@v2/models',
            '@v2/components',
            '@v2/features',
            '@v2/pages',
        ]
    }
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-deep-module-imports", rule, {

    valid: [
        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "require('@v2/commmons/module/InternalFile')",
            filename: "@v2/commons/anotherModule/MyFile.js",
            settings,
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
