const path = require('path');

const createUtils = (cwd, settings) => {
    const aliases = Object.keys(settings.path);

    /**
     * Resolves import path to full path
     * @param importPath {string} E.g. "@modules/xyz/index.js"
     * @returns {string} E.g. "/root/src/modules/xyz/index.js"
     */
    const resolveFullPath = (importPath) => {
        var alias = aliases.find(value => importPath.startsWith(value));

        if (alias) {
            importPath = importPath.replace(alias, settings.path[alias])
        }

        return path.resolve([cwd, importPath].join('/'));
    }

    const resolve = (raw) => {
        const realPath = resolveFullPath(raw);
        return {
            raw,
            realPath,
            path: pathToVirtual(realPath)
        }
    }

    const resolveFromFullPath = (raw) => {
        return {
            raw,
            realPath: raw,
            path: pathToVirtual(raw)
        }
    }

    const categories = settings.modules.map(value => resolveFullPath(value));

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
