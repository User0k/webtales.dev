import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { POSTS_PATH } from '../constants/paths';
import { MatterDataWithContent, PostData } from '@/types';

export function getSortedPosts(): PostData[] {
  const dirs = fs.readdirSync(POSTS_PATH);
  const posts = dirs
    .map((dirName) => {
      const markdownWithMeta = fs.readFileSync(
        path.join(`${POSTS_PATH}/${dirName}/index.md`),
        'utf-8',
      );
      const { data: frontmatter } = matter(markdownWithMeta);
      return {
        slug: dirName,
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
        image: frontmatter.image,
        tags: frontmatter.tags,
      };
    })
    .sort((post1, post2) => post2.date - post1.date);

  return posts;
}

function transformImagesPaths(content: string, slug: string) {
  const regex = /(!\[.*?\]\()\.\//g;
  return content.replace(regex, `$1/posts/${slug}/`);
}

export function getPostContent(slug: string): MatterDataWithContent {
  const file = `${POSTS_PATH}/${slug}/index.md`;
  const { content, data } = matter(fs.readFileSync(file, 'utf-8'));
  const postData = {
    title: data.title,
    date: data.date,
    description: data.description,
    image: data.image,
    tags: data.tags,
  };

  return { content: transformImagesPaths(content, slug), data: postData };
}
