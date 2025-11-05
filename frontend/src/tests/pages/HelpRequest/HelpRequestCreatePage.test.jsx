import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("HelpRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /helprequests", async () => {
    const queryClient = new QueryClient();
    const helpRequest = {
      id: 3,
      requesterEmail: "student2@ucsb.edu",
      teamId: "02",
      tableOrBreakoutRoom: "5",
      requestTime: "2022-04-03T12:00:00",
      explanation: "React app not compiling.",
      solved: true,
    };
    axiosMock.onPost("/api/helprequests/post").reply(202, helpRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText("Requester Email");
    expect(emailInput).toBeInTheDocument();

    const teamIdInput = screen.getByLabelText("Team Id");
    expect(teamIdInput).toBeInTheDocument();

    const tableInput = screen.getByLabelText("Table Or Breakout Room");
    expect(tableInput).toBeInTheDocument();

    // If your form label is exactly "Request Time (ISO Format)" keep it, otherwise match your form
    const timeInput = screen.getByLabelText("Request Time (ISO Format)");
    expect(timeInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const solvedCheckbox = screen.getByLabelText("Solved");
    expect(solvedCheckbox).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();


    fireEvent.change(emailInput, { target: { value: "student2@ucsb.edu" } });
    fireEvent.change(teamIdInput, { target: { value: "02" } });
    fireEvent.change(tableInput, { target: { value: "5" } });
    fireEvent.change(timeInput, { target: { value: "2022-04-03T12:00:00" } });
    fireEvent.change(explanationInput, {
      target: { value: "React app not compiling." },
    });
    fireEvent.click(solvedCheckbox); // set solved = true

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "student2@ucsb.edu",
      teamId: "02",
      tableOrBreakoutRoom: "5",
      requestTime: "2022-04-03T12:00",
      explanation: "React app not compiling.",
      solved: true,
    });

    // Toast message (matches your create page's onSuccess for HelpRequest)
    expect(mockToast).toBeCalledWith(
      "New Help Request created - id: 3, requester: student2@ucsb.edu",
    );

    // Navigate back to list
    expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });
  });
});

