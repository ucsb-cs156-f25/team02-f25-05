const recommendationRequestFixtures = {
  oneRequest: [
    {
      id: 1,
      requesterEmail: "student2@ucsb.edu",
      professorEmail: "prof2@ucsb.edu",
      explanation: "More salad!",
      dateRequested: "2025-10-10T12:00:00",
      dateNeeded: "2025-11-12T10:00:05",
      done: true,
    },
  ],

  threeRequests: [
    {
      id: 1,
      requesterEmail: "student2@ucsb.edu",
      professorEmail: "prof2@ucsb.edu",
      explanation: "More salad!",
      dateRequested: "2025-10-10T12:00:00",
      dateNeeded: "2025-11-12T10:00:05",
      done: true,
    },
    {
      id: 2,
      requesterEmail: "student3@ucsb.edu",
      professorEmail: "prof3@ucsb.edu",
      explanation: "More pasta!",
      dateRequested: "2025-10-10T12:00:00",
      dateNeeded: "2025-11-12T10:00:05",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "student4@ucsb.edu",
      professorEmail: "prof4@ucsb.edu",
      explanation: "More fish!",
      dateRequested: "2025-10-31T06:12:02.292",
      dateNeeded: "2025-10-31T06:12:02.292",
      done: true,
    },
  ],
};

export { recommendationRequestFixtures };
