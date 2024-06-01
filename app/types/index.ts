export type PostData = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  photoBy?: string;
  tags: string[];
};

export type MatterDataWithContent = {
  content: string;
  data: Omit<PostData, 'slug'>;
};

export type SlugParams = {
  params: {
    slug: string;
  };
  searchParams: {
    tags?: string[];
  };
};
