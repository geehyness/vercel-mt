import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas'; // Correct path

export default defineConfig({
  name: 'default',
  title: 'MeditationTimes',
  projectId: 'nf8eqs51',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes, // Now properly references all schemas
  },
});