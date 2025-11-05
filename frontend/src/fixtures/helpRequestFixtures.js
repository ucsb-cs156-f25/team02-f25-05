const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "student@ucsb.edu",
    teamId: "01", // was "team01"
    tableOrBreakoutRoom: "5", // was "Table 5"
    explanation: "Having trouble connecting to the database.",
    solved: false,
    requestTime: "2022-01-02T12:00:00",
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "student1@ucsb.edu",
      teamId: "01", // was "team01"
      tableOrBreakoutRoom: "5", // was "Table 5"
      explanation: "Can't deploy to Heroku.",
      solved: false,
      requestTime: "2022-01-02T12:00:00",
    },
    {
      id: 2,
      requesterEmail: "student2@ucsb.edu",
      teamId: "02", // was "team02"
      tableOrBreakoutRoom: "1", // was "Breakout Room 1"
      explanation: "React app not compiling.",
      solved: true,
      requestTime: "2022-04-03T12:00:00",
    },
    {
      id: 3,
      requesterEmail: "student3@ucsb.edu",
      teamId: "03", // was "team03"
      tableOrBreakoutRoom: "7", // was "Table 7"
      explanation: "Need help with Docker setup.",
      solved: false,
      requestTime: "2022-07-04T12:00:00",
    },
  ],
};

export { helpRequestFixtures };
