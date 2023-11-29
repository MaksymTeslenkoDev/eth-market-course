import { Course } from "@/content/courses/types";
import Web3 from "web3";

export const COURSE_STATES = {
  0: "purchased",
  1: "activated",
  2: "deactivated",
};

export type NormalizedCourse = Partial<Course> & {
  price: string;
  ownedCourseId: string;
  proof: string;
  owned: string;
  state: string;
} & { hash?: string };
export const normalizeOwnedCourse =
  (web3: Web3) =>
  (
    course: Course | null | { hash: string },
    ownedCourse: any
  ): NormalizedCourse => {
    if (course) {
      if ("id" in course) {
        return {
          ...course,
          ownedCourseId: ownedCourse.id,
          proof: ownedCourse.proof,
          owned: ownedCourse.owner,
          price: web3.utils.fromWei(ownedCourse.price),
          state: COURSE_STATES[ownedCourse.state as keyof typeof COURSE_STATES],
        };
      }

      return {
        ...course,
        ownedCourseId: ownedCourse.id,
        proof: ownedCourse.proof,
        owned: ownedCourse.owner,
        price: web3.utils.fromWei(ownedCourse.price),
        state: COURSE_STATES[ownedCourse.state as keyof typeof COURSE_STATES],
      };
    }
    return {
      ownedCourseId: ownedCourse.id,
      proof: ownedCourse.proof,
      owned: ownedCourse.owner,
      price: web3.utils.fromWei(ownedCourse.price),
      state: COURSE_STATES[ownedCourse.state as keyof typeof COURSE_STATES],
    };
  };
