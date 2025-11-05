import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("HelpRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit HelpRequest");
      expect(screen.queryByTestId("HelpRequest-requesterEmail")).not.toBeInTheDocument(); //??????
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "student2@ucsb.edu",
        teamId: "02",
        tableOrBreakoutRoom: "5",
        requestTime: "2022-04-03T12:00", // datetime-local format (no seconds)
        explanation: "React app not compiling.",
        solved: true,
      });

      axiosMock.onPut("/api/helprequests").reply(200, {
        id: 17,
        requesterEmail: "student2@ucsb.edu",
        teamId: "02",
        tableOrBreakoutRoom: "7",
        requestTime: "2022-04-03T13:30",
        explanation: "Issue resolved after cache clear.",
        solved: true,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
      const timeField = screen.getByTestId("HelpRequestForm-requestTime");
      const explanationField = screen.getByTestId("HelpRequestForm-explanation");
      const solvedSwitch = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("student2@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("02");
      expect(tableField).toBeInTheDocument();
      expect(tableField).toHaveValue("5");
      expect(timeField).toBeInTheDocument();
      expect(timeField).toHaveValue("2022-04-03T12:00"); // datetime-local (no seconds)
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("React app not compiling.");
      expect(solvedSwitch).toBeInTheDocument();

      expect(submitButton).toHaveTextContent("Update");


      // Make some changes
      fireEvent.change(emailField, { target: { value: "student2@ucsb.edu" } }); // keep same or change as you like
      fireEvent.change(teamIdField, { target: { value: "02" } });
      fireEvent.change(tableField, { target: { value: "7" } });
      fireEvent.change(timeField, { target: { value: "2022-04-03T13:30" } });
      fireEvent.change(explanationField, {
        target: { value: "Issue resolved after cache clear." },
      });
      // Toggle solved (if initial was true in your mock, you can leave as-is or click to flip)
      // fireEvent.click(solvedSwitch);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "HelpRequest Updated - id: 17 requester: student2@ucsb.edu",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      //??????????
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "student2@ucsb.edu",
          teamId: "02",
          tableOrBreakoutRoom: "7",
          requestTime: "2022-04-03T13:30",
          explanation: "Issue resolved after cache clear.",
          solved: true,
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const emailField = screen.getByTestId("HelpRequestForm-requesterEmail");
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
      const timeField = screen.getByTestId("HelpRequestForm-requestTime");
      const explanationField = screen.getByTestId("HelpRequestForm-explanation");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(emailField).toHaveValue("student2@ucsb.edu");
      expect(teamIdField).toHaveValue("02");
      expect(tableField).toHaveValue("5");
      expect(timeField).toHaveValue("2022-04-03T12:00");
      expect(explanationField).toHaveValue("React app not compiling.");
      expect(submitButton).toBeInTheDocument();

        // Change a couple fields
      fireEvent.change(tableField, { target: { value: "7" } });
      fireEvent.change(explanationField, {
        target: { value: "Issue resolved after cache clear." },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "HelpRequest Updated - id: 17 requester: student2@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
    });
  });
});
