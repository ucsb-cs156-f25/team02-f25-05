const recommendationRequestFixtures = {
  oneRequest: [
    {
        requesterEmail: "student1@ucsb.edu",
        professorEmail: "prof1@ucsb.edu",
        explanation: "More pizza!",
        dateRequested: "2025-10-30T12:00:00",
        dateNeeded: "2025-10-31T12:10:10",
        done: false,
    },
  ],

  threeRequests: [
    {
        requesterEmail: "student2@ucsb.edu",
        professorEmail: "prof2@ucsb.edu",
        explanation: "More salad!",
        dateRequested: "2025-10-10T12:00:00",
        dateNeeded: "2025-11-12T10:00:05",
        done: false
    },

    {
        requesterEmail: "student3@ucsb.edu",
        professorEmail: "prof3@ucsb.edu",
        explanation: "More pasta!",
        dateRequested: "2025-9-1T12:00:00",
        dateNeeded: "2025-9-2T09:00:00",
        done: true
    },

    {
        requesterEmail: "student4@ucsb.edu",
        professorEmail: "prof4@ucsb.edu",
        explanation: "More fish!",
        dateRequested: "2025-8-30T11:00:00",
        dateNeeded: "2025-11-31T12:02:00",
        done: false
    },
  ],
};

export { recommendationRequestFixtures };
