export interface Course {
  id: string;
  type: string;
  title: string;
  description: string;
  coverImage: string;
  author: string;
  link: string;
  slug: string;
  wsl: string[];
  createdAt: string;
  state: string;
}

export type CourseMap = {
  [key: string]: Course & { index: number };
};

export interface GetCourses {
  data: Array<Course>;
  courseMap: CourseMap;
}
