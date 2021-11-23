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
        const {resolve, resolveFromFullPath, findModule} = createUtils(context.getCwd(), context.settings.htg);

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const isReachingIntoModule = (file, module) => file.path.replace(module, '').split('/').length > 1;

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            ImportDeclaration: (node) => {
                const contextFileName = context.getFilename();

                const target = resolve(node.source.value, contextFileName);
                const source = resolveFromFullPath(contextFileName);

                const targetModule = findModule(target);
                if (!targetModule) return;

                const sourceModule = findModule(source);
                if (targetModule === sourceModule) return;

                const isReaching = isReachingIntoModule(target, targetModule);
                if (!isReaching) return;

                context.report({
                    node: node.source,
                    message: `HTG: Reaching deep into the module. Use modules public interface.`,
                });
            }

        };
    }
};
