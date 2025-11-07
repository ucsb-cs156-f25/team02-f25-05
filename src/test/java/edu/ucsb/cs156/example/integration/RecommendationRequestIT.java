package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestIT {
  @Autowired public CurrentUserService currentUserService;

  @Autowired public GrantedAuthoritiesService grantedAuthoritiesService;

  @Autowired RecommendationRequestRepository recommendationRequestRepository;

  @Autowired public MockMvc mockMvc;

  @Autowired public ObjectMapper mapper;

  @MockitoBean UserRepository userRepository;

  @WithMockUser(roles = {"USER"})
  @Test
  public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
    // arrange
    LocalDateTime dateRequested = LocalDateTime.parse("2022-01-03T00:00:00");
    LocalDateTime dateNeeded = LocalDateTime.parse("2026-01-03T00:00:00");

    RecommendationRequest recommendationRequest =
        RecommendationRequest.builder()
            .requesterEmail("student@ucsb.edu")
            .professorEmail("professor@ucsb.edu")
            .explanation("Need recommendation for graduate school")
            .dateRequested(dateRequested)
            .dateNeeded(dateNeeded)
            .done(false)
            .build();

    recommendationRequestRepository.save(recommendationRequest);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/recommendationrequest?id=1"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    recommendationRequest.setId(1L);
    String expectedJson = mapper.writeValueAsString(recommendationRequest);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"ADMIN", "USER"})
  @Test
  public void an_admin_user_can_post_a_new_recommendation_request() throws Exception {
    // arrange
    LocalDateTime dateRequested = LocalDateTime.parse("2022-01-03T00:00:00");
    LocalDateTime dateNeeded = LocalDateTime.parse("2026-01-03T00:00:00");

    RecommendationRequest recommendationRequest1 =
        RecommendationRequest.builder()
            .id(1L)
            .requesterEmail("student@ucsb.edu")
            .professorEmail("professor@ucsb.edu")
            .explanation("Need water!")
            .dateRequested(dateRequested)
            .dateNeeded(dateNeeded)
            .done(false)
            .build();

    // act
    MvcResult response =
        mockMvc
            .perform(
                post("/api/recommendationrequest/post?requesterEmail=student@ucsb.edu&professorEmail=professor@ucsb.edu&explanation=Need water!&dateRequested=2022-01-03T00:00:00&dateNeeded=2026-01-03T00:00:00&done=false")
                    .with(csrf()))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String expectedJson = mapper.writeValueAsString(recommendationRequest1);
    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedJson, responseString);
  }

  @WithMockUser(roles = {"USER"})
  @Test
  public void test_that_logged_in_user_can_get_all_recommendation_requests() throws Exception {
    // arrange
    LocalDateTime dateRequested1 = LocalDateTime.parse("2022-01-03T00:00:00");
    LocalDateTime dateNeeded1 = LocalDateTime.parse("2026-01-03T00:00:00");
    LocalDateTime dateRequested2 = LocalDateTime.parse("2023-02-15T12:30:00");
    LocalDateTime dateNeeded2 = LocalDateTime.parse("2027-05-20T18:45:00");

    RecommendationRequest request1 =
        RecommendationRequest.builder()
            .requesterEmail("student1@ucsb.edu")
            .professorEmail("professor1@ucsb.edu")
            .explanation("Need some burgers!")
            .dateRequested(dateRequested1)
            .dateNeeded(dateNeeded1)
            .done(false)
            .build();

    RecommendationRequest request2 =
        RecommendationRequest.builder()
            .requesterEmail("student2@ucsb.edu")
            .professorEmail("professor2@ucsb.edu")
            .explanation("Can we have more ice cream?")
            .dateRequested(dateRequested2)
            .dateNeeded(dateNeeded2)
            .done(true)
            .build();

    recommendationRequestRepository.save(request1);
    recommendationRequestRepository.save(request2);

    // act
    MvcResult response =
        mockMvc
            .perform(get("/api/recommendationrequest/all"))
            .andExpect(status().isOk())
            .andReturn();

    // assert
    String responseString = response.getResponse().getContentAsString();
    // Response should contain both requests - check that it's not empty and contains key fields
    assert (responseString.contains("student1@ucsb.edu"));
    assert (responseString.contains("student2@ucsb.edu"));
    assert (responseString.contains("professor1@ucsb.edu"));
    assert (responseString.contains("professor2@ucsb.edu"));
  }
}
