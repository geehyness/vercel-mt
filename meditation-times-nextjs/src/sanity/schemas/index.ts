import { type SchemaTypeDefinition } from 'sanity';
import post from './post';
import author from './author';
import biblePassage from './biblePassage';
import user from './user';
import discussion from './discussion';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, author, biblePassage, user, discussion],
};