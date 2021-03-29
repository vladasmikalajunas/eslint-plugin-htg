# eslint-plugin-htg

HTG eslint plugin

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-htg`:

```
$ npm install eslint-plugin-htg --save-dev
```


## Usage

Add `htg` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "htg"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "htg/no-deep-module-imports": 2
    }
}
```

## Settings

You may set the following settings in your .eslintrc:

```js
module.exports = {
    settings: {
        htg: {
            path: {
                '@modules/': 'src/modules/'
            },
            modules: [
                '@modules/commons',
                '@modules/models',
                '@modules/components',
                '@modules/features',
                '@modules/pages',
            ]
        }
    },
}
```

### `settings.htg.path`

Define path aliases for import resolution.

### `settings.htg.modules`

Provide an array of paths to directories containing modules.
