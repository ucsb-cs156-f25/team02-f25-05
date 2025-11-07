package edu.ucsb.cs156.example.integration;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.MenuItemReviews;
import edu.ucsb.cs156.example.repositories.MenuItemReviewsRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewsWebIT extends WebTestCase {
  @Autowired public CurrentUserService currentUserService;

  @Autowired public GrantedAuthoritiesService grantedAuthoritiesService;

  @Autowired MenuItemReviewsRepository menuItemReviewsRepository;

  @Autowired public MockMvc mockMvc;

  @Autowired public ObjectMapper mapper;

  @MockitoBean UserRepository userRepository;

  @WithMockUser(roles = {"USER"})
  @Test
  public void admin_user_can_see_existing_entries() throws Exception {
    // arrange: create a MenuItemReview directly in the repository
    LocalDateTime dateReviewed = LocalDateTime.parse("2023-01-01T12:00:00");
    MenuItemReviews review =
        MenuItemReviews.builder()
            .itemId(2L)
            .reviewerEmail("test@gmail.com")
            .stars(3)
            .dateReviewed(dateReviewed)
            .comments("great")
            .build();

    menuItemReviewsRepository.save(review);

    // act: log in as admin and go to the page
    setupUser(true);

    page.getByText("Menu Item Reviews").click();

    // assert: confirm that the entry is visible
    assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-comments")).hasText("great");
  }

  @Test
  public void regular_user_cannot_create_menuitemreview() throws Exception {
    setupUser(false);

    page.getByText("Menu Item Reviews").click();

    assertThat(page.getByText("Create MenuItemReview")).not().isVisible();
    assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-itemId")).not().isVisible();
  }
}
