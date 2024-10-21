export const eventsData = [
  {
    department: "CECT",
    events: [
      {
        eventName: "AI Workshop",
        date: "2024-10-21",
        time: "10:00 AM",
        location: "Room 101, CECT Building",
        description:
          "An in-depth workshop on AI and machine learning technologies.",
        organizer: {
          name: "John Doe",
          contactInfo: "johndoe@example.com",
        },
        mandatory: true,
        eventStatus: "upcoming",
      },
      {
        eventName: "Data Science Seminar",
        date: "2024-10-22",
        time: "2:00 PM",
        location: "Room 202, CECT Building",
        description: "A seminar on data science and its applications.",
        organizer: {
          name: "Jane Smith",
          contactInfo: null,
        },
        mandatory: false,
        eventStatus: "upcoming",
      },
    ],
  },
  {
    department: "CAMS",
    events: [
      {
        eventName: "Media Ethics Panel",
        date: "2024-11-09",
        time: "1:00 PM",
        location: "Main Auditorium, CAMS",
        description: "A panel discussion on ethics in media and journalism.",
        organizer: {
          name: "Lisa Brown",
          contactInfo: "lisa.brown@cams.edu",
        },
        mandatory: true,
        eventStatus: "started",
      },
    ],
  },
];
