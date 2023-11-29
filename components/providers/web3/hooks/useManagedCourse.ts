import { normalizeOwnedCourse } from "@utils/normalize";
import useSWR, { SWRResponse } from "swr";
import Web3 from "web3";
import { AccountHandler } from "./useAccountHandler";

export type ManagedCourseHandler = SWRResponse;

export const handler =
  (web3?: Web3 | null, contract?: any) => (account: AccountHandler) => {
    const swrRes = useSWR(
      () =>
        web3 && contract && account.data && account.isAdmin
          ? `web3/managedCourses/${account}`
          : null,
      async () => {
        const courses = [];
        const courseCount = await contract.methods.getCourseCount().call();

        for (let i = Number(courseCount) - 1; i >= 0; i--) {
          const courseHash = await contract.methods
            .getCourseHashAtIndex(i)
            .call();
          const course = await contract.methods
            .getCourseByHash(courseHash)
            .call();

          if (course) {
            const normalized = normalizeOwnedCourse(web3!)(
              { hash: courseHash as string },
              course
            );
            courses.push(normalized);
          }
        }

        return courses;
      }
    );
    return swrRes;
  };
