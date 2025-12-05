import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'impactpost',
  title: 'IMPACT POST CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Articles')
              .schemaType('article')
              .child(S.documentTypeList('article').title('All Articles')),
            S.divider(),
            S.listItem()
              .title('Events')
              .schemaType('event')
              .child(S.documentTypeList('event').title('All Events')),
            S.divider(),
            S.listItem()
              .title('Authors')
              .schemaType('author')
              .child(S.documentTypeList('author').title('All Authors')),
            S.listItem()
              .title('Content Pillars')
              .schemaType('category')
              .child(S.documentTypeList('category').title('All Pillars')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
