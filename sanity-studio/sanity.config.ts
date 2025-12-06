import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { writerType } from './schemas/writer';
import { siteSettingsType } from './schemas/siteSettings';
import { aboutPageType } from './schemas/aboutPage';

export default defineConfig({
  name: 'lc-reading-series',
  title: 'Lewis & Clark Reading Series',

  projectId: 'o7465upq',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: [writerType, siteSettingsType, aboutPageType],
  },
});
