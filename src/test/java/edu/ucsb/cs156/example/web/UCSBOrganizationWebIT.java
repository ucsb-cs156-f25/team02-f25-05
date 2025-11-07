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
public class UCSBOrganizationWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_organization() throws Exception {
    setupUser(true);

    page.getByText("UCSB Organizations").click();

    page.getByText("Create Organization").click();
    assertThat(page.getByText("Create New Organization")).isVisible();
    page.getByTestId("UCSBOrganizationForm-orgCode").fill("AKI");
    page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Alpha Kappa Id");
    page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Alpha Kappa Id");
    page.getByTestId("UCSBOrganizationForm-inactive").selectOption("false");
    page.getByTestId("UCSBOrganizationForm-submit").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslation"))
        .hasText("Alpha Kappa Id");

    page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Organization")).isVisible();
    page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Alpha Kappa Icarus");
    page.getByTestId("UCSBOrganizationForm-submit").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslation"))
        .hasText("Alpha Kappa Icarus");

    page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-name")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_organization() throws Exception {
    setupUser(false);

    page.getByText("Organizations").click();

    assertThat(page.getByText("Create Organization")).not().isVisible();
    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-name")).not().isVisible();
  }

  @Test
  public void admin_user_can_see_create_organization() throws Exception {
    setupUser(true);

    page.getByText("Organizations").click();

    assertThat(page.getByText("Create Organization")).isVisible();
  }
}
