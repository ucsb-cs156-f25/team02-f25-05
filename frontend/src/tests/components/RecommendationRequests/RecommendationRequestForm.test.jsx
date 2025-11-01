import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qc = new QueryClient();

function renderForm(initialContents) {
  render(
    <QueryClientProvider client={qc}>
      <Router>
        <RecommendationRequestForm initialContents={initialContents} />
      </Router>
    </QueryClientProvider>
  );
}


test("normalizes dateRequested that ends with Z to include seconds", () => {
  renderForm({
    id: 1,
    requesterEmail: "a@x.com",
    professorEmail: "p@x.com",
    explanation: "e",
    dateRequested: "2025-10-10T12:00Z",
    dateNeeded:    "2025-11-12T10:00Z",
    done: true,
  });


  expect(screen.getByLabelText("Date Requested")).toHaveValue("2025-10-10T12:00");
  expect(screen.getByLabelText("Date Needed")).toHaveValue("2025-11-12T10:00");
});

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("RecommendationRequestForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Requester Email",
    "Professor Email",
    "Explanation",
    "Date Requested",
    "Date Needed",
    "Done",
  ];
  const testId = "RecommendationRequestForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
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
          <RecommendationRequestForm
            initialContents={recommendationRequestFixtures.oneRequest[0]}
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

    expect(screen.getByLabelText("Id")).toHaveValue(
      String(recommendationRequestFixtures.oneRequest[0].id),
    );
    expect(screen.getByLabelText("Requester Email")).toHaveValue(
      recommendationRequestFixtures.oneRequest[0].requesterEmail,
    );
    expect(screen.getByLabelText("Professor Email")).toHaveValue(
      recommendationRequestFixtures.oneRequest[0].professorEmail,
    );
    expect(screen.getByLabelText("Explanation")).toHaveValue(
      recommendationRequestFixtures.oneRequest[0].explanation,
    );
    expect(screen.getByLabelText("Date Requested")).toHaveValue(
      recommendationRequestFixtures.oneRequest[0].dateRequested,
    );
    expect(screen.getByLabelText("Date Needed")).toHaveValue(
      recommendationRequestFixtures.oneRequest[0].dateNeeded,
    );
    expect(screen.getByLabelText("Done")).toHaveValue(
      String(recommendationRequestFixtures.oneRequest[0].done),
    );
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
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
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required\./i);
    expect(
      screen.getByText(/Professor Email is required\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required\./i)).toBeInTheDocument();
    expect(
      screen.getByText(/Date Requested is required\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required\./i)).toBeInTheDocument();
    expect(screen.getByText(/Done is required\./i)).toBeInTheDocument();

    const emailInput = screen.getByTestId(`${testId}-requesterEmail`);
    fireEvent.change(emailInput, { target: { value: "a".repeat(256) } }); // > 255 to trigger maxLength

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });
  });

  // append to RecommendationRequestForm.test.jsx
  test("uses stable data-testids (guards against Stryker StringLiteral)", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    const prefix = "RecommendationRequestForm";

    // Must exist with the exact suffix
    [
      "-professorEmail",
      "-explanation",
      "-dateRequested",
      "-dateNeeded",
      "-done",
      "-submit",
    ].forEach((suffix) => {
      expect(screen.getByTestId(prefix + suffix)).toBeInTheDocument();
    });

    // There must NOT be an element with the bare prefix (catches mutation to `+ ""`)
    expect(screen.queryByTestId(prefix)).not.toBeInTheDocument();
  });
});
