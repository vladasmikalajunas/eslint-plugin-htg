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

            const contextFilename = context.getFilename();

            const target = resolve(node.source.value, contextFilename);
            const source = resolveFromFullPath(contextFilename);

            const targetModule = findModule(target);
            if (!targetModule) return;

            const sourceModule = findModule(source);

            if (targetModule !== sourceModule) return;

            if (target.raw[0] === '.') return;

            context.report({
                node: node.source,
                message: errorMessage,
                fix: function(fixer) {
                    if (target.path === sourceModule) return; // Importing via module public interface. Not autofixable. Need manually to check what thing is being imported and use internal path.

                    // node.source.raw: "@modules/myModule/file.js"
                    // node.source.value: @modules/myModule/file.js

                    return fixer.replaceText(
                        node.source,
                        node.source.raw.replace(
                            node.source.value,
                            getRelativePath(source.path, target.path)
                        )
                    );
                }
            });
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            ImportDeclaration: createValidator(`HTG: Importing local dependency via global path.`),
            ExportNamedDeclaration: createValidator(`HTG: Exporting local dependency via global path.`),
        };
    }
};
