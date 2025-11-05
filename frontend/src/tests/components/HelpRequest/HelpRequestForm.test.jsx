import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("HelpRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByText(/Requester Email/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Requester Email/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a HelpRequest", async () => {
    render(
      <Router>
        <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
      </Router>,
    );
    await screen.findByTestId(/HelpRequestForm-id/);
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByTestId("HelpRequestForm-id")).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-requesterEmail");
    const requesterEmailField = screen.getByTestId(
      "HelpRequestForm-requesterEmail",
    );
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableOrBreakoutRoomField = screen.getByTestId(
      "HelpRequestForm-tableOrBreakoutRoom",
    );
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const solvedField = screen.getByTestId("HelpRequestForm-solved");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "not a requesterEmail" },
    });
    fireEvent.change(teamIdField, { target: { value: "not a teamId" } });
    fireEvent.change(tableOrBreakoutRoomField, {
      target: { value: "not a tableOrBreakoutRoom" },
    });
    fireEvent.change(requestTimeField, {
      target: { value: "not a requestTime" },
    });
    fireEvent.change(explanationField, {
      target: {
        value:
          "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.",
      },
    });
    fireEvent.change(solvedField, { target: { value: "not a solved" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email must be a valid email address./);

    expect(
      screen.getByText(/Requester Email must be a valid email address./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Team Id must be a number./)).toBeInTheDocument();
    expect(
      screen.getByText(/Table Or Breakout Room must be a number./),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Explanation must be at most 250 characters./),
    ).toBeInTheDocument();
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-submit");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Requester Email is required./);

    expect(
      screen.getByText(/Requester Email is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Team Id is required./)).toBeInTheDocument();
    expect(
      screen.getByText(/Table Or Breakout Room is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <HelpRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-requesterEmail");

    const requesterEmailField = screen.getByTestId(
      "HelpRequestForm-requesterEmail",
    );
    const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
    const tableOrBreakoutRoomField = screen.getByTestId(
      "HelpRequestForm-tableOrBreakoutRoom",
    );
    const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
    const explanationField = screen.getByTestId("HelpRequestForm-explanation");
    const solvedField = screen.getByTestId("HelpRequestForm-solved");
    const submitButton = screen.getByTestId("HelpRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "chrisgaucho@ucsb.edu" },
    });
    fireEvent.change(teamIdField, { target: { value: "16" } });
    fireEvent.change(tableOrBreakoutRoomField, { target: { value: "16" } });
    fireEvent.change(requestTimeField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(explanationField, {
      target: { value: "Tests pass locally but fail on Gradescope." },
    });
    fireEvent.change(solvedField, { target: { value: true } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Requester Email must be a valid email address./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Team Id must be a number./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Table Or Breakout Room must be a number./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Explanation must be at most 250 characters./),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(/Requester Email is required./),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Team Id is required./)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Table Or Breakout Room is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Request Time is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Explanation is required./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <HelpRequestForm />
      </Router>,
    );
    await screen.findByTestId("HelpRequestForm-cancel");
    const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});