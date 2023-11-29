import Web3 from "web3";
import { Course } from "@/content/courses/types";
import useSWR, { SWRResponse } from "swr";
import { normalizeOwnedCourse } from "@/utils/normalize";
import { createCourseHash } from "@/utils/hash";

export type OwnedCourseHandler = SWRResponse;

export const handler =
  (web3?: Web3 | null, contract?: any) =>
  (course: Course, account: string): OwnedCourseHandler => {
    const swrRes = useSWR(
      () =>
        web3 && contract && account ? `web3/ownedCourse/${account}` : null,
      async () => {
        if (!course.id) {
          return null;
        }

        const courseHash = createCourseHash(web3!)(course.id, account);
        const ownedCourse = await contract.methods
          .getCourseByHash(courseHash)
          .call();
        if (
          ownedCourse.owner === "0x0000000000000000000000000000000000000000"
        ) {
          return null;
        }

        return normalizeOwnedCourse(web3!)(course, ownedCourse);
      }
    );

    return swrRes;
  };
