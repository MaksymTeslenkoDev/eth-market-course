import courses from "./index.json";
import { Course, CourseMap, GetCourses } from "./types";

const mapCourses = (courses: Array<Course>) => {
  return courses.reduce((acc, course, index) => {
    acc[course.id] = { ...course, index };
    return acc;
  }, {} as CourseMap);
};

export const getAllCourses = (): GetCourses => {
  return {
    data: courses as Array<Course>,
    courseMap: mapCourses(courses as Array<Course>),
  };
};
