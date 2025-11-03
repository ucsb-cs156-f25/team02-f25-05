import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {
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
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationRequests", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 1,
      requesterEmail: "student2@ucsb.edu",
      professorEmail: "professor2@ucsb.edu",
      explanation: "This is an explanation",
      dateRequested: "2025-10-10T12:00:00Z",
      dateNeeded: "2025-11-12T10:00:00Z",
      done: "true",
    };

    axiosMock
      .onPost("/api/recommendationrequest/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByLabelText("Requester Email");
    expect(requesterEmailInput).toBeInTheDocument();

    const professorEmailInput = screen.getByLabelText("Professor Email");
    expect(professorEmailInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const dateRequestedInput = screen.getByLabelText("Date Requested");
    expect(dateRequestedInput).toBeInTheDocument();

    const dateNeededInput = screen.getByLabelText("Date Needed");
    expect(dateNeededInput).toBeInTheDocument();

    const doneInput = screen.getByLabelText("Done");
    expect(doneInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Requester Email/i), {
      target: { value: "student2@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText(/Professor Email/i), {
      target: { value: "professor2@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText(/Explanation/i), {
      target: { value: "This is an explanation" },
    });
    fireEvent.change(screen.getByLabelText(/Date Requested/i), {
      target: { value: "2025-10-10T12:00" },
    });
    fireEvent.change(screen.getByLabelText(/Date Needed/i), {
      target: { value: "2025-11-12T10:00" },
    });
    fireEvent.change(screen.getByLabelText(/Done/i), {
      target: { value: "true" },
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    const params = axiosMock.history.post[0].params;
    expect(params.dateRequested).toMatch(/^2025-10-10T12:00Z$/);
    expect(params.dateNeeded).toMatch(/^2025-11-12T10:00Z$/);

    // sanity checks: not missing or double-Z
    expect(params.dateRequested.endsWith("Z")).toBe(true);
    expect(params.dateRequested.endsWith("ZZ")).toBe(false);

    expect(axiosMock.history.post[0].params).toEqual(
      expect.objectContaining({
        requesterEmail: "student2@ucsb.edu",
        professorEmail: "professor2@ucsb.edu",
        explanation: "This is an explanation",
      }),
    );


    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New Recommendation Request Created - id: 1 requesterEmail: student2@ucsb.edu",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/RecommendationRequest" });
  });
});
