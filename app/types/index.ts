export type PostData = {
  slug: string;
  title: string;
  date: string;
  image: string;
  tags: string[];
};

export type SlugParams = {
  params: {
    slug: string;
  };
  searchParams: {
    tags?: string[];
  };
};
