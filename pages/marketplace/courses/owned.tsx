import {
  useAccount,
  useOwnedCourses,
  useWalletInfo,
} from "@/components/hooks/web3";
import { getAllCourses } from "@/content/courses/fetcher";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { CoursesProps } from "..";
import { NormalizedCourse } from "@/utils/normalize";
import { useRouter } from "next/router";
import Link from "next/link";
import { useWeb3 } from "@/components/providers";

export default function OwnedCourses({ courses }: CoursesProps) {
  const router = useRouter();
  const { account } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account);
  const { requireInstall } = useWeb3();
  return (
    <>
      {/* {ownedCourses.data} */}
      <MarketHeader />
      <section className="grid grid-cols-1">
        {ownedCourses.isEmpty && (
          <div className="w-1/2">
            <Message>
              <div>You don&apos;t own any courses</div>
              <Link legacyBehavior href="/marketplace">
                <a className="font-normal hover:underline">
                  <i>Purchase Course</i>
                </a>
              </Link>
            </Message>
          </div>
        )}
        {(!account || account.isEmpty) && (
          <div className="w-1/2">
            <Message type="danger">
              <div>Please connect to Metamask</div>
            </Message>
          </div>
        )}
        {requireInstall && (
          <div className="w-1/2">
            <Message type="danger">
              <div>Please install Metamask</div>
            </Message>
          </div>
        )}
        {ownedCourses.data &&
          ownedCourses.data.map((course: NormalizedCourse) => (
            <OwnedCourseCard key={course.id} course={course}>
              <Button onClick={() => router.push(`/courses/${course.slug}`)}>
                Watch the course
              </Button>
            </OwnedCourseCard>
          ))}
      </section>
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();
  return { props: { courses: data } };
}

OwnedCourses.Layout = BaseLayout;
