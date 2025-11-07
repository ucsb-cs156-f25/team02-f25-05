package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_recommendation_request() throws Exception {
    setupUser(true);

    page.getByText("Recommendation Request").click();

    page.getByText("Create RecommendationRequest").click();
    assertThat(page.getByText("Create New RecommendationRequest")).isVisible();
    page.getByLabel("Requester Email").fill("student@ucsb.edu");
    page.getByLabel("Professor Email").fill("prof@ucsb.edu");
    page.getByLabel("Explanation").fill("Need recommendation");
    page.getByLabel("Date Requested").fill("2022-01-03T00:00");
    page.getByLabel("Date Needed").fill("2026-01-03T00:00");
    page.getByLabel("Done").selectOption("false");

    page.getByTestId("RecommendationRequestForm-submit").click();

    // Wait for navigation back to index page and table to load
    page.waitForSelector("[data-testid='recommendationRequestTable-cell-row-0-col-explanation']");
    assertThat(page.getByTestId("recommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("Need recommendation");

    page.getByTestId("recommendationRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Recommendation Request")).isVisible();
    page.getByTestId("RecommendationRequestForm-explanation").fill("THE BEST");
    page.getByTestId("RecommendationRequestForm-submit").click();

    page.getByTestId("RecommendationRequestForm-submit").click();

    // Wait for navigation back to index page after edit and verify update
    page.waitForSelector("[data-testid='recommendationRequestTable-cell-row-0-col-explanation']");
    assertThat(page.getByTestId("recommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("THE BEST");

    page.getByTestId("recommendationRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("recommendationRequestTable-cell-row-0-col-requesterEmail"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_recommendation_request() throws Exception {
    setupUser(false);

    page.getByText("Recommendation Request").click();

    assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
    assertThat(page.getByTestId("recommendationRequestTable-cell-row-0-col-requesterEmail"))
        .not()
        .isVisible();
  }
}
