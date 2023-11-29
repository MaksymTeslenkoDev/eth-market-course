import { useManagedCourses, useAdmin } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers";
import { NormalizedCourse } from "@/utils/normalize";
import { withToast } from "@/utils/toast";
import { Button, Message } from "@components/ui/common";
import { CourseFilter, ManagedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { normalizeOwnedCourse } from "@utils/normalize";
import { useEffect, useState } from "react";

const VerificationInput = ({
  onVerify,
}: {
  onVerify: (email: string) => void;
}) => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..."
      />
      <Button
        onClick={() => {
          onVerify(email);
        }}
      >
        Verify
      </Button>
    </div>
  );
};

export default function ManagedCourses() {
  const [proofedOwnership, setProofedOwnership] = useState<
    Record<string, boolean>
  >({});
  const [searchedCourse, setSearchedCourse] = useState<NormalizedCourse | null>(
    null
  );
  const {
    web3State: { web3, contract },
  } = useWeb3();
  const [filters, setFilters] = useState({ state: "all" });

  const account = useAdmin({ redirectTo: "/marketplace" });
  const { managedCourses } = useManagedCourses(account);
  const verifyCourse = (
    email: string,
    { hash, proof }: { hash: string | undefined; proof: string }
  ) => {
    if (!web3) return;
    if (!hash) throw new Error("Hash wasn't provided");

    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash || "" },
      { type: "bytes32", value: hash }
    );

    proofToCheck === proof
      ? setProofedOwnership((proofed) => ({
          ...proofed,
          [hash]: true,
        }))
      : setProofedOwnership((proofed) => ({
          ...proofed,
          [hash]: false,
        }));
  };

  const changeCourseState = async (
    courseHash: string | undefined,
    method: string
  ) => {
    if (!courseHash) throw new Error("Hash wasn't provided for activating");
    try {
      const result = await contract.methods[method](courseHash).send({
        from: account.data,
      });
      return result;
    } catch (e: unknown) {
      if (e instanceof Error) throw new Error(e.message);
      throw new Error("Changing course state has failed");
    }
  };

  const activateCourse = async (courseHash: string | undefined) => {
    withToast(changeCourseState(courseHash, "activateCourse"));
  };

  const deactivateCourse = async (courseHash: string | undefined) => {
    withToast(changeCourseState(courseHash, "deactivateCourse"));
  };

  const searchCourse = async (courseHash: string) => {
    const re = /[0-9A-Fa-f]{6}/g;

    if (!web3) return;
    if (courseHash && courseHash.length === 66 && re.test(courseHash)) {
      const course = await contract.methods.getCourseByHash(courseHash).call();

      if (course.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedCourse(web3)(
          { hash: courseHash },
          course
        );
        setSearchedCourse(normalized);
        return;
      }
    }

    setSearchedCourse(null);
  };

  const renderCard = (course: NormalizedCourse, isSearched?: boolean) => {
    return (
      <ManagedCourseCard
        key={course.ownedCourseId}
        course={course}
        isSearched={isSearched}
      >
        <VerificationInput
          onVerify={(email) => {
            verifyCourse(email, {
              hash: course.hash,
              proof: course.proof,
            });
          }}
        />
        {course.hash && proofedOwnership[course.hash] && (
          <div className="mt-2">
            <Message>Verified!</Message>
          </div>
        )}
        {course.hash && proofedOwnership[course.hash] === false && (
          <div className="mt-2">
            <Message type="danger">Wrong Proof!</Message>
          </div>
        )}

        {course.state === "purchased" && (
          <div className="mt-2">
            <Button onClick={() => activateCourse(course.hash)} variant="green">
              Activate
            </Button>
            <Button onClick={() => deactivateCourse(course.hash)} variant="red">
              Deactivate
            </Button>
          </div>
        )}
      </ManagedCourseCard>
    );
  };

  const filteredCourses = managedCourses.data
    ?.filter((course: NormalizedCourse) => {
      if (filters.state === "all") {
        return true;
      }
      return course.state === filters.state;
    })
    .map((course: NormalizedCourse) => renderCard(course));

  if (!account.isAdmin) {
    return null;
  }

  return (
    <>
      <MarketHeader />
      <CourseFilter
        onFilterSelect={(value) => setFilters({ state: value })}
        onSearchSubmit={searchCourse}
      />
      <section className="grid grid-cols-1">
        {searchedCourse && (
          <div>
            <h1 className="text-2xl font-bold p-5">Search</h1>
            {renderCard(searchedCourse, true)}
          </div>
        )}
        <h1 className="text-2xl font-bold p-5">All Courses</h1>
        {filteredCourses}
        {filteredCourses?.length === 0 && (
          <Message type="warning">No courses to display</Message>
        )}
      </section>
    </>
  );
}

ManagedCourses.Layout = BaseLayout;
