import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@/content/courses/fetcher";
import { Course } from "@/content/courses/types";
import { CourseCard, CourseList } from "@components/ui/course";
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { Button, Loader, Message } from "@components/ui/common";
import { OrderModal } from "@/components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@/components/ui/marketplace";
import { OrderForm } from "@/components/ui/order/modal";
import { useWeb3 } from "@components/providers";
import { toast } from "react-toastify";
import { withToast } from "@/utils/toast";

export interface CoursesProps {
  courses: Array<Course>;
}
export default function Marketplace({ courses }: CoursesProps) {
  const {
    web3State: { web3, contract },
    requireInstall,
  } = useWeb3();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [busyCourseId, setBusyCourseId] = useState<string | null>(null);
  const { hasConnectedWallet, account, isConnecting } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account);
  const [isNewPurchase, setIsNewPurchase] = useState(true);

  const purchaseCourse = async (order: OrderForm, course: Course) => {
    if (!web3) return;
    if (!selectedCourse) return;

    const hexCourseId = web3.utils.utf8ToHex(course.id);
    const orderHash = web3.utils.soliditySha3(
      {
        type: "bytes16",
        value: hexCourseId,
      },
      { type: "address", value: account }
    );

    const value = web3.utils.toWei(String(order.price!));
    setBusyCourseId(course.id);

    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash! },
        { type: "bytes32", value: orderHash! }
      );
      if (!proof) return;
      await withToast(_purchaseCourse({ hexCourseId, proof, value }, course));
    } else {
      if (!orderHash) return;
      withToast(_repurchaseCourse({ courseHash: orderHash, value }, course));
    }
  };

  const _purchaseCourse = async (
    {
      hexCourseId,
      proof,
      value,
    }: {
      hexCourseId: string;
      proof: string;
      value: string;
    },
    course: Course
  ) => {
    try {
      const result: { transactionHash: string } = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account, value });

      ownedCourses.mutate([
        ...ownedCourses.data,
        {
          ...course,
          proof,
          state: "purchased",
          owner: account.data,
          price: value,
        },
      ]);
      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new Error("Purchase order has failed");
    } finally {
      setBusyCourseId(null);
    }
  };
  const _repurchaseCourse = async (
    {
      courseHash,
      value,
    }: {
      courseHash: string;
      value: string;
    },
    course: Course
  ) => {
    try {
      const result: { transactionHash: string } = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account, value });
      const index = ownedCourses.data.findIndex(
        (c: Course) => c.id === course.id
      );

      if (index >= 0) {
        ownedCourses.data[index].state = "purchased";
        ownedCourses.mutate(ownedCourses.data);
      } else {
        ownedCourses.mutate();
      }
      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new Error("Purchase order has failed");
    } finally {
      setBusyCourseId(null);
    }
  };

  const cleanupModal = () => {
    setSelectedCourse(null);
    setIsNewPurchase(true);
  };

  return (
    <>
      <MarketHeader />
      <CourseList courses={courses}>
        {(course) => {
          const owned = ownedCourses.lookup[course.id];
          return (
            <CourseCard
              key={course.id}
              course={course}
              state={owned?.state}
              disabled={!hasConnectedWallet}
              Footer={() => {
                if (requireInstall) {
                  return (
                    <Button size="sm" disabled={true} variant="lightPurple">
                      Install
                    </Button>
                  );
                }
                if (isConnecting) {
                  return (
                    <Button size="sm" disabled={true} variant="lightPurple">
                      <Loader size="sm" />
                    </Button>
                  );
                }

                if (!ownedCourses.hasInitialResponse) {
                  return (
                    <Button variant="white" disabled={true} size="sm">
                      {hasConnectedWallet ? "Loading State..." : "Connect"}
                    </Button>
                  );
                }

                const isBusy = busyCourseId === course.id;

                if (owned) {
                  return (
                    <>
                      <div className="flex">
                        <Button size="sm" disabled={true} variant="white">
                          Yours &#10004;
                        </Button>
                        {owned.state === "deactivated" && (
                          <Button
                            size="sm"
                            disabled={isBusy}
                            variant="purple"
                            onClick={() => {
                              setIsNewPurchase(false);
                              setSelectedCourse(course);
                            }}
                          >
                            {isBusy ? (
                              <div className="flex">
                                <Loader size="sm" />
                                <div className="ml-2">In Progress</div>
                              </div>
                            ) : (
                              <div>Fund to Activate</div>
                            )}
                          </Button>
                        )}
                      </div>
                    </>
                  );
                }

                return (
                  <Button
                    size="sm"
                    onClick={() => setSelectedCourse(course)}
                    disabled={!hasConnectedWallet || isBusy}
                    variant="lightPurple"
                  >
                    {isBusy ? (
                      <div className="flex">
                        <Loader size="sm" />
                        <div className="ml-2">In Progress</div>
                      </div>
                    ) : (
                      <div>Purchase</div>
                    )}
                  </Button>
                );
              }}
            />
          );
        }}
      </CourseList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          isNewPurchase={isNewPurchase}
          onSubmit={(formData, course) => {
            purchaseCourse(formData, course);
            cleanupModal();
          }}
          onClose={cleanupModal}
        />
      )}
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();
  return { props: { courses: data } };
}
Marketplace.Layout = BaseLayout;
