"use strict";

const {createUtils} = require('../utils');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Enforce correct module imports",
            category: "Fill me in",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {
        const {resolve, getCategories, findModule, stripCwd} = createUtils(context.getCwd(), context.settings.htg);

        const categories = getCategories();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const isReachingIntoModule = (importPath, module) => importPath.replace(module, '').split('/').length > 1;

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            ImportDeclaration: (node) => {
                const {source} = node;
                const importPath = resolve(source.value);
                const filePath = context.getFilename();

                const importModule = findModule(categories, importPath);
                if (!importModule) return;

                const fileModule = findModule(categories, filePath);
                if (importModule === fileModule) return;

                const isReaching = isReachingIntoModule(importPath, importModule);
                if (!isReaching) return;

                context.report({
                    node: node,
                    message: `HTG: Reaching deep into the module. Use modules public interface.`,
                });
            }

        };
    }
};
