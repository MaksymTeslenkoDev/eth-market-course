import { Course } from "@/content/courses/types";
import { createCourseHash } from "@/utils/hash";
import { normalizeOwnedCourse } from "@utils/normalize";
import useSWR, { SWRResponse } from "swr";
import Web3 from "web3";

export type OwnedCoursesHandler = SWRResponse & {
  lookup: Record<string, Partial<Course>>;
};
export const handler =
  (web3?: Web3 | null, contract?: any) =>
  (courses: Array<Course>, account: string): OwnedCoursesHandler => {
    const swrRes = useSWR(
      () =>
        web3 && contract && account ? `web3/ownedCourses/${account}` : null,
      async () => {
        const ownedCourses: Array<Partial<Course>> = [];
        for (const course of courses) {
          if (!course.id) {
            continue;
          }

          const courseHash = createCourseHash(web3!)(course.id, account);
          const ownedCourse = await contract.methods
            .getCourseByHash(courseHash)
            .call();
          if (
            ownedCourse.owner !== "0x0000000000000000000000000000000000000000"
          ) {
            const normalizedOwnedCourse = normalizeOwnedCourse(web3!)(
              course,
              ownedCourse
            );
            ownedCourses.push(normalizedOwnedCourse);
          }
        }
        // debugger;
        return ownedCourses;
      }
    );
    return {
      ...swrRes,
      lookup:
        swrRes.data?.reduce((a, c) => {
          if (c.id) {
            a[c.id] = c;
          }
          return a;
        }, {} as Record<string, Partial<Course>>) ?? {},
    };
  };
