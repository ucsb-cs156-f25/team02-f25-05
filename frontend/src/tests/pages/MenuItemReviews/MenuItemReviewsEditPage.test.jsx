import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

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
describe("MenuItemReviewsEditPage tests", () => {
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
      axiosMock.onGet("/api/menuitemreviews", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item Review");
      expect(
        screen.queryByTestId("MenuItemReviewsForm-itemId"),
      ).not.toBeInTheDocument();
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
      axiosMock
        .onGet("/api/menuitemreviews", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemId: 5,
          reviewerEmail: "test@example.com",
          stars: 4,
          dateReviewed: "2025-11-04T12:12:00",
          comments: "Great item!",
        });
      axiosMock.onPut("/api/menuitemreviews").reply(200, {
        id: 17,
        itemId: 5,
        reviewerEmail: "test@example.com",
        stars: 5,
        dateReviewed: "2025-11-04T12:12",
        comments: "Excellent item!",
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
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewsForm-id");

      const idField = screen.getByTestId("MenuItemReviewsForm-id");
      const itemIdField = screen.getByTestId("MenuItemReviewsForm-itemId");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReviewsForm-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewsForm-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemIdField).toHaveValue("5");
      expect(reviewerEmailField).toHaveValue("test@example.com");
      expect(starsField).toHaveValue("4");
      expect(dateReviewedField).toHaveValue("2025-11-04T12:12");
      expect(commentsField).toHaveValue("Great item!");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(commentsField, { target: { value: "Excellent item!" } });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith("Menu Item Reviews Updated - id: 17");
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: 5,
          reviewerEmail: "test@example.com",
          stars: 4,
          dateReviewed: "2025-11-04T12:12:00",
          comments: "Excellent item!",
        }),
      );
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewsForm-itemId");

      const starsField = screen.getByTestId("MenuItemReviewsForm-stars");
      const commentsField = screen.getByTestId("MenuItemReviewsForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewsForm-submit");

      fireEvent.change(starsField, { target: { value: 5 } });
      fireEvent.change(commentsField, { target: { value: "Excellent item!" } });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith("Menu Item Reviews Updated - id: 17");
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreviews" });
    });
  });
});
