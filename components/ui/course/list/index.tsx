import { Course } from "@/content/courses/types";
import { CoursesProps } from "@/pages";

interface ListProps extends CoursesProps {
  children(course: Course): React.ReactNode | JSX.Element;
}
export default function List({ courses, children }: ListProps) {
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      {courses.map((course) => children(course)!)}
    </section>
  );
}
