const path = require('path');

const createUtils = (cwd, settings) => {
    const settingsPath = settings.path || {};
    const settingsModules = settings.modules || [];

    const aliases = Object.keys(settingsPath);

    /**
     * Resolves import path to full path
     * @param importPath {string} E.g. "@modules/xyz/index.js"
     * @returns {string} E.g. "/root/src/modules/xyz/index.js"
     */
    const resolveFullPath = (importPath) => {
        var alias = aliases.find(value => importPath.startsWith(value));

        if (alias) {
            importPath = importPath.replace(alias, settingsPath[alias])
        }

        return path.resolve([cwd, importPath].join('/'));
    }

    const resolve = (raw, sourceFile) => {
        let realPath;

        if (raw[0] === '.') {
            if (!sourceFile) throw new Error(`resolve: Tried resolving a relative path without source file (raw="${raw}")`)
            if (sourceFile[0] !== '/') throw new Error(`resolve: Parameter sourceFile must be a full path "${sourceFile}"`);
            realPath = path.resolve(path.dirname(sourceFile), raw);
        } else {
            realPath = resolveFullPath(raw);
        }

        return {
            raw,
            realPath,
            path: pathToVirtual(realPath)
        }
    }

    const resolveFromFullPath = (raw) => {
        if (raw[0] !== '/') throw new Error(`resolveFromFullPath: Not a full path "${raw}"`);
        return {
            raw,
            realPath: raw,
            path: pathToVirtual(raw)
        }
    }

    const sortByPathDepth = (a, b) => {
        const aLength = a.split('/').length;
        const bLength = b.split('/').length;
        if (aLength === bLength) return 0;
        return aLength > bLength ? -1 : 1;
    }

    // Sorting is needed because when matching modules - deeper paths must take priority
    const categories = [...settingsModules].sort(sortByPathDepth).map(value => resolveFullPath(value));

    /**
     * Resolves full path to virtual path
     * @param path {string} E.g. "/root/src/modules/apps/demo/index.js"
     * @returns {string} E.g. "/root/src/modules/apps/*\/index.js"
     */
    const pathToVirtual = (path) => {
        for (let c = 0;  c < categories.length; c++) {
            const category = categories[c];

            const categoryParts = category.split('*');

            let tempPath = path;
            for (let i = 0; i < categoryParts.length; i++) {
                const categoryPart = categoryParts[i];
                if (tempPath.startsWith(categoryPart)) {
                    const restOfPath = tempPath.replace(categoryPart, '').split('/');
                    restOfPath.shift();
                    tempPath = '/' + restOfPath.join('/');

                    if (i === categoryParts.length - 1) {
                        return category + tempPath;
                    }
                }
            }
        }

        return path;
    }

    const stripCwd = (path) => path.replace(cwd, '');

    const findCategory = (file) => categories.find(value => file.path.startsWith(value));

    const findModule = (file) => {
        const category = findCategory(file);

        if (!category) return;

        const moduleName = file.path.replace(category, '').split('/')[1];

        return [category, moduleName].join('/');
    };

    return {
        resolveFullPath, resolve, resolveFromFullPath, stripCwd, findCategory, findModule,
        getCategories: () => categories
    };
}

const getRelativePath = (from, to) => {
    const prefix = path.relative(path.dirname(from), path.dirname(to)) || '.';
    return (prefix[0] !== '.' ? './' : '') + `${prefix}/${path.basename(to)}`;
}

module.exports = {
    createUtils,
    getRelativePath
}
