export interface PartData {
  Contents?: string;
  Type: string;
}

export interface PostData {
  AuthorName: string;
  PostId: string;
  PostShortId: string;
  Category: string;
  CreatedAt: string;
  Description: string;
  ImageKey: string;
  ImageS3Url: string;
  Parts: Array<PartData>;
  SubTitle: string;
  Tags: Array<string>;
  Title: string;
  IsDraft: boolean;
  IsNewPost: boolean;
}

interface SlugTitle {
  Slug: string;
  Title: string;
}

export interface PostDataWithNextPrev extends PostData {
  PrevPost?: SlugTitle;
  NextPost?: SlugTitle;
}
