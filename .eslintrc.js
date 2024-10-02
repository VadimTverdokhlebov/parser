module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'airbnb-typescript/base', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint', 'import'],
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module'
    },
    rules: {
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'always',
                ts: 'never'
            }
        ],
        '@typescript-eslint/no-implicit-any-catch': 'off',
        'no-unused-vars': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/indent': 'off',
        'no-restricted-syntax': ['error', 'BinaryExpression[operator="of"]'],
        'no-underscore-dangle': 'off',
        indent: 'off',
        'no-console': 'off'
    },
    globals: {
        module: 'readonly',
        __dirname: 'readonly'
    }
};
