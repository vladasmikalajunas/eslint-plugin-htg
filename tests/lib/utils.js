const assert = require('assert');
const {createUtils, getRelativePath} = require('../../lib/utils');

describe('createUtils', function () {
    let utils;

    beforeEach(() => {
        utils = createUtils('/root', {
                path: {
                    '@modules/': 'src/modules/'
                },
                modules: [
                    '@modules/commons',
                    '@modules/models',
                    '@modules/components',
                    '@modules/features',
                    '@modules/pages',
                    '@modules/apps/*/pages',
                ]
            }
        );
    });

    describe('resolve', function () {
        it('should resolve aliased path', function () {
            const result = utils.resolve('@modules/models/module/file.js');

            assert.strictEqual(result, '/root/src/modules/models/module/file.js');
        });

        it('should resolve regular file path', function () {
            const result = utils.resolve('src/a/b/file.js');

            assert.strictEqual(result, '/root/src/a/b/file.js');
        });

        it('should resolve navigating to parent dir', function () {
            const result = utils.resolve('../src/a/b/file.js');

            assert.strictEqual(result, '/src/a/b/file.js');
        });

        it('should resolve current dir', function () {
            const result = utils.resolve('./src/a/b/file.js');

            assert.strictEqual(result, '/root/src/a/b/file.js');
        });
    });

    describe('pathToVirtual', function () {
        it('should resolve path to virtual path with wildcards', function () {
            const result = utils.pathToVirtual('/root/src/modules/apps/demo/pages/page1/file.js');

            assert.strictEqual(result, '/root/src/modules/apps/*/pages/page1/file.js');
        });

        it('should return original path if wildcard paths are not matched', function () {
            const result = utils.pathToVirtual('/root/src/modules/some/page/here.js');

            assert.strictEqual(result, '/root/src/modules/some/page/here.js');
        });
    });

    describe('stripCwd', function () {
        it('should remove CWD from path', function () {
            const result = utils.stripCwd('/root/src/modules/models/module/file.js');

            assert.strictEqual(result, '/src/modules/models/module/file.js');
        });

        it('should keep path intact if it is not global', function () {
            const result = utils.stripCwd('src/a/b/file.js');

            assert.strictEqual(result, 'src/a/b/file.js');
        });
    });

    describe('getCategories', function () {
        it('should return categories with absolute paths', function () {
            const result = utils.getCategories();

            assert.deepStrictEqual(result, [
                '/root/src/modules/commons',
                '/root/src/modules/models',
                '/root/src/modules/components',
                '/root/src/modules/features',
                '/root/src/modules/pages',
                '/root/src/modules/apps/*/pages'
            ]);
        });
    });

    describe('findCategory', function () {
        it('should return absolute path to the category', function () {
            const result = utils.findCategory('/root/src/modules/pages/a/index.js');

            assert.strictEqual(result,'/root/src/modules/pages');
        });

        it('should return absolute path to the wildcard category', function () {
            const result = utils.findCategory('/root/src/modules/apps/*/pages/a/index.js');

            assert.strictEqual(result,'/root/src/modules/apps/*/pages');
        });

        it('should return undefined if path is not part of cateogry', function () {
            const result = utils.findCategory('/root/src/a/b/c/index.js');

            assert.strictEqual(result,undefined);
        });
    });

    describe('findModule', function () {
        it('should return absolute path to the module', function () {
            const result = utils.findModule('/root/src/modules/pages/a/index.js');

            assert.strictEqual(result,'/root/src/modules/pages/a');
        });

        it('should return absolute path to the wildcard module', function () {
            const result = utils.findModule('/root/src/modules/apps/*/pages/a/index.js');

            assert.strictEqual(result,'/root/src/modules/apps/*/pages/a');
        });

        it('should return undefined if path is not part of module', function () {
            const result = utils.findModule('/root/src/a/b/c/index.js');

            assert.strictEqual(result,undefined);
        });
    });
});

describe('getRelativePath', function () {
    it('should return relative path for files in different directories', function () {
        const result = getRelativePath('/a/b/c/d.js', '/a/b/x/y.js');

        assert.strictEqual(result,'../x/y.js');
    });
    it('should return relative path for files in same directory', function () {
        const result = getRelativePath('/a/x.js', '/a/y.js');

        assert.strictEqual(result,'./y.js');
    });
    it('should return relative path to deeply nested directory', function () {
        const result = getRelativePath('/d.js', '/a/b/x/y.js');

        assert.strictEqual(result,'./a/b/x/y.js');
    });
    it('should return relative path to root of directory', function () {
        const result = getRelativePath('/a/b/x/y.js', '/d.js');

        assert.strictEqual(result,'../../../d.js');
    });
});
