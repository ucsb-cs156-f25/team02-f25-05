const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "alicegaucho@ucsb.edu",
    teamId: "01",
    tableOrBreakoutRoom: "01",
    requestTime: "2025-10-31T05:06:22.141Z",
    explanation: "f25-01: Need help with git:sync on dokku.",
    solved: true,
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "alicegaucho@ucsb.edu",
      teamId: "01",
      tableOrBreakoutRoom: "01",
      requestTime: "2025-10-31T05:06:22.141Z",
      explanation: "Need help with git:sync on dokku.",
      solved: true,
    },
    {
      id: 2,
      requesterEmail: "bobgaucho@ucsb.edu",
      teamId: "08",
      tableOrBreakoutRoom: "08",
      requestTime: "2025-11-01T05:06:22.141Z",
      explanation: "Cant login with Google account on localhost.",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "chrisgaucho@ucsb.edu",
      teamId: "16",
      tableOrBreakoutRoom: "16",
      requestTime: "2025-11-02T05:06:22.141Z",
      explanation: "Tests pass locally but fail on Gradescope.",
      solved: true,
    },
  ],
};

export { helpRequestFixtures };