// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generate } = require('@graphql-codegen/cli');

module.exports.GetCollection = 'src/typings/graphql.gql.d.ts';
const generateGraphqlBindings = async () => {
  const watch = process.argv[2] === '--watch';
  await generate(
    {
      overwrite: true,
      schema: 'schemas/shopify-admin.json',
      documents: 'src/**/*.graphql',
      generates: {
        'src/typings/graphql.ts': {
          plugins: [
            'typescript',
            'typescript-operations',
            'typescript-generic-sdk',
          ],
          config: {
            skipTypename: false,
          },
        },
      },
      watch,
    },
    true,
  );
};

generateGraphqlBindings();
