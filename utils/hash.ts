import Web3 from "web3";

export const createCourseHash =
  (web3: Web3) => (courseId: string, account: string) => {
    const hexCourseId = web3.utils.utf8ToHex(courseId);
    const courseHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account }
    );

    return courseHash;
  };
