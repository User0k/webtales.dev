import { getPostContent } from '@/utils/getPosts';
import { SlugParams } from '@/types';

function Post({params: { slug }}: SlugParams) {
  const contennt = getPostContent(slug);
  return <div>{contennt}</div>;
}

export default Post;
