export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  viewCount: number;
  author: {
    name: string;
    avatar: string | null;
  } | null;
}

export interface Reply {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    avatar: string | null;
  } | null;
}
