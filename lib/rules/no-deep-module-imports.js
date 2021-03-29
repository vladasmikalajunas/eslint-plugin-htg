"use strict";

const { createUtils } = require('../utils');

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

    create: function(context) {
        const { resolve, getCategories, findCategory } = createUtils(context);

        const categories = getCategories();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const isReachingIntoModule = (importPath, module) => importPath.replace(module, '').split('/').length > 2;

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            ImportDeclaration: (node) => {
                const { source } = node;
                const importPath = resolve(source.value);
                const filePath = context.getFilename();

                const importCategory = findCategory(categories, importPath);
                if (!importCategory) return;

                const fileCategory = findCategory(categories, filePath);
                if (importCategory === fileCategory) return;

                const isReaching = isReachingIntoModule(importPath, importCategory);
                if (!isReaching) return;

                context.report({
                    node: node,
                    message: `HTG: Reaching deep into the module. Use modules public interface.`
                });
            }

        };
    }
};
