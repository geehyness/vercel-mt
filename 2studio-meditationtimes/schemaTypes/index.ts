// schemaTypes/index.ts
import postSchema from './postSchema'
import authorSchema from './authorSchema'
import categorySchema from './categorySchema'
import aboutPage from './aboutPage'
import discussion from './discussion'
import { reply } from './reply'
import { biblePassage } from './biblePassage'
import  kidsLesson  from './kidsLesson'
import { quizQuestion } from './quizQuestion'
import user from './user'


export const schemaTypes = [
  postSchema,
  authorSchema,
  categorySchema,
  aboutPage,
  discussion,
  reply,
  biblePassage,
  kidsLesson,
  quizQuestion,
  user
]