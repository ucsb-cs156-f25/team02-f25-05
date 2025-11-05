import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import MenuItemReviewsForm from "main/components/MenuItemReviews/MenuItemReviewsForm";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewsForm tests", () => {
  const queryClient = new QueryClient();
  const testId = "MenuItemReviewsForm";

  const expectedHeaders = [
    "Item Id",
    "Reviewer Email",
    "Stars",
    "Date Reviewed(iso format)",
    "Comments",
  ];

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewsForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewsForm
            initialContents={menuItemReviewsFixtures.oneReview}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewsForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewsForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/itemId is required/);
    expect(screen.getByText(/ReviewerEmail is required/)).toBeInTheDocument();
    expect(screen.getByText(/stars is required/)).toBeInTheDocument();
    expect(screen.getByText(/DateReviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comments is required/)).toBeInTheDocument();

    const itemIdInput = screen.getByTestId(`${testId}-itemId`);
    fireEvent.change(itemIdInput, { target: { value: "123" } });

    const reviewerEmailInput = screen.getByTestId(`${testId}-reviewerEmail`);
    fireEvent.change(reviewerEmailInput, { target: { value: "a".repeat(31) } });

    const starsInput = screen.getByTestId(`${testId}-stars`);
    fireEvent.change(starsInput, { target: { value: 5 } });

    const dateReviewedInput = screen.getByTestId(`${testId}-dateReviewed`);
    fireEvent.change(dateReviewedInput, { target: { value: "2025-11-02" } });

    const commentsInput = screen.getByTestId(`${testId}-comments`);
    fireEvent.change(commentsInput, { target: { value: "b".repeat(31) } });

    const submitButtonById = screen.getByTestId(`${testId}-submit`);
    fireEvent.click(submitButtonById);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    });
  });
});
