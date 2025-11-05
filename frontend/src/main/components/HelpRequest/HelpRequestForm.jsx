import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function HelpRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // normalize initial contents for editing
  // when undefined → create mode → show example defaults
  const normalizedInitialContents = initialContents
    ? {
        ...initialContents,
        solved:
          initialContents.solved === true
            ? "true"
            : initialContents.solved === false
            ? "false"
            : initialContents.solved ?? "",
        requestTime: initialContents.requestTime
          ? initialContents.requestTime.slice(0, 16)
          : "",
      }
    : {
        requesterEmail: "",
        teamId: "",
        tableOrBreakoutRoom: "",
        explanation: "",
        solved: "",
        requestTime: "",
      };

  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: normalizedInitialContents });
  // Stryker restore all

  const navigate = useNavigate();

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks
  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const teamid_regex = /^[A-Za-z0-9_-]+$/;
  // Stryker restore Regex

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="HelpRequestForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-requesterEmail"
              id="requesterEmail"
              type="email"
              placeholder="student@ucsb.edu"
              isInvalid={Boolean(errors.requesterEmail)}
              {...register("requesterEmail", {
                required: "Requester email is required.",
                pattern: {
                  value: email_regex,
                  message: "Requester email must be a valid email address.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.requesterEmail?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="teamId">Team Id</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-teamId"
              id="teamId"
              type="text"
              placeholder="team01"
              isInvalid={Boolean(errors.teamId)}
              {...register("teamId", {
                required: "Team id is required.",
                pattern: {
                  value: teamid_regex,
                  message:
                    "Team id may only contain letters, numbers, underscore, or dash.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.teamId?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="tableOrBreakoutRoom">
              Table or Breakout Room
            </Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-tableOrBreakoutRoom"
              id="tableOrBreakoutRoom"
              type="text"
              placeholder="Table 5 or Breakout Room 2"
              isInvalid={Boolean(errors.tableOrBreakoutRoom)}
              {...register("tableOrBreakoutRoom", {
                required: "Table or breakout room is required.",
                maxLength: {
                  value: 100,
                  message:
                    "Table or breakout room must be at most 100 characters.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.tableOrBreakoutRoom?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="explanation">Explanation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              data-testid="HelpRequestForm-explanation"
              id="explanation"
              placeholder="Describe your issue here..."
              isInvalid={Boolean(errors.explanation)}
              {...register("explanation", {
                required: "Explanation is required.",
                minLength: {
                  value: 5,
                  message: "Explanation should be at least 5 characters.",
                },
                maxLength: {
                  value: 1000,
                  message: "Explanation should be at most 1000 characters.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.explanation?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="solved">Solved</Form.Label>
            <Form.Select
              data-testid="HelpRequestForm-solved"
              id="solved"
              isInvalid={Boolean(errors.solved)}
              {...register("solved", {
                required: "Solved is required.",
              })}
            >
              <option value="">Select...</option>
              <option value="false">false</option>
              <option value="true">true</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.solved?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="requestTime">Request Time (iso)</Form.Label>
            <Form.Control
              data-testid="HelpRequestForm-requestTime"
              id="requestTime"
              type="datetime-local"
              isInvalid={Boolean(errors.requestTime)}
              {...register("requestTime", {
                required: "Request time is required.",
                pattern: {
                  value: isodate_regex,
                  message: "Request time must be in ISO format.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.requestTime?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="HelpRequestForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            data-testid="HelpRequestForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default HelpRequestForm;
