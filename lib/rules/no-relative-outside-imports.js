"use strict";

const {createUtils, getRelativePath} = require('../utils');
const path = require('path');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Enforce relative paths for local module files",
            category: "Fill me in",
            recommended: false
        },
        fixable: "code",
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {
        const {resolve, resolveFromFullPath, findModule} = createUtils(context.getCwd(), context.settings.htg);

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const createValidator = (errorMessage) => (node) => {
            if (!node.source) return;

            const contextFileName = context.getFilename();

            const target = resolve(node.source.value, contextFileName);
            const source = resolveFromFullPath(contextFileName);

            if (target.raw[0] !== '.') return;

            const targetModule = findModule(target);
            const sourceModule = findModule(source);

            if (targetModule === sourceModule) return;

            context.report({
                node: node.source,
                message: errorMessage
            });
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDeclaration: createValidator(`HTG: Reaching out of module with relative path.`),
            ExportNamedDeclaration: createValidator(`HTG: Reaching out of module with relative path.`),
        };
    }
};
