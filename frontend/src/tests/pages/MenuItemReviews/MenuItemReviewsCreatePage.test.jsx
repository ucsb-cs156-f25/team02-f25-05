import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
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

describe("MenuItemReviewsCreatePage tests", () => {
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
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {
    const queryClient = new QueryClient();
    const newReview = {
      id: 5,
      itemId: 7,
      reviewerEmail: "testuser@example.com",
      stars: 4,
      dateReviewed: "2025-11-04T00:00:00",
      comments: "Excellent taste!",
    };

    axiosMock.onPost("/api/menuitemreviews/post").reply(202, newReview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("Item Id");
    const reviewerEmailInput = screen.getByLabelText("Reviewer Email");
    const starsInput = screen.getByLabelText("Stars");
    const dateReviewedInput = screen.getByLabelText(
      "Date Reviewed(iso format)",
    );
    const commentsInput = screen.getByLabelText("Comments");
    const createButton = screen.getByText("Create");

    fireEvent.change(itemIdInput, { target: { value: "7" } });
    fireEvent.change(reviewerEmailInput, {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(starsInput, { target: { value: "4" } });
    fireEvent.change(dateReviewedInput, {
      target: { value: "2025-11-04T00:00" },
    });
    fireEvent.change(commentsInput, { target: { value: "Excellent taste!" } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "7",
      reviewerEmail: "testuser@example.com",
      stars: "4",
      dateReviewed: "2025-11-04T00:00",
      comments: "Excellent taste!",
    });

    expect(mockToast).toBeCalledWith("New Menu Item Review Created - id: 5");
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });
  });
});
