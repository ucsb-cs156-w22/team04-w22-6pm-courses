package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.PersonalSchedule;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.repositories.PersonalScheduleRepository;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = PersonalSchedulesController.class)
@Import(TestConfig.class)
public class PersonalSchedulesControllerTests extends ControllerTestCase {

    @MockBean
    PersonalScheduleRepository PersonalScheduleRepository;

    @MockBean
    UserRepository userRepository;

    // Authorization tests for /api/PersonalSchedules/admin/all

    @Test
    public void api_PersonalSchedules_admin_all__logged_out__returns_403() throws Exception {
        mockMvc.perform(get("/api/personalschedules/admin/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_PersonalSchedules_admin_all__user_logged_in__returns_403() throws Exception {
        mockMvc.perform(get("/api/personalschedules/admin/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_PersonalSchedules_admin__user_logged_in__returns_403() throws Exception {
        mockMvc.perform(get("/api/personalschedules/admin?id=7"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void api_PersonalSchedules_admin_all__admin_logged_in__returns_200() throws Exception {
        mockMvc.perform(get("/api/personalschedules/admin/all"))
                .andExpect(status().isOk());
    }

    // Authorization tests for /api/PersonalSchedules/all

    @Test
    public void api_PersonalSchedules_all__logged_out__returns_403() throws Exception {
        mockMvc.perform(get("/api/personalschedules/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_PersonalSchedules_all__user_logged_in__returns_200() throws Exception {
        mockMvc.perform(get("/api/personalschedules/all"))
                .andExpect(status().isOk());
    }

    // Authorization tests for /api/PersonalSchedules/post

    @Test
    public void api_PersonalSchedules_post__logged_out__returns_403() throws Exception {
        mockMvc.perform(post("/api/personalschedules/post"))
                .andExpect(status().is(403));
    }

    // Tests with mocks for database actions

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_PersonalSchedules__user_logged_in__returns_a_PersonalSchedule_that_exists() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder()
                .name("name 1")
                .description("description 1")
                .quarter("quarter 1")
                .user(u)
                .id(7L)
                .build();
        when(PersonalScheduleRepository.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.of(PersonalSchedule1));

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules?id=7"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(PersonalScheduleRepository, times(1)).findByIdAndUser(7L, u);
        String expectedJson = mapper.writeValueAsString(PersonalSchedule1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_PersonalSchedules__user_logged_in__search_for_PersonalSchedule_that_does_not_exist() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();

        when(PersonalScheduleRepository.findByIdAndUser(eq(7L), eq(u))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules?id=7"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(PersonalScheduleRepository, times(1)).findByIdAndUser(7L, u);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 7 not found", json.get("message"));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_PersonalSchedules__user_logged_in__search_for_PersonalSchedule_that_belongs_to_another_user() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(999L).build();
        PersonalSchedule otherUsersPersonalSchedule = PersonalSchedule.builder()
                .name("name 1")
                .description("description 1")
                .quarter("quarter 1")
                .user(u)
                .id(13L)
                .build();
            

        when(PersonalScheduleRepository.findByIdAndUser(eq(13L), eq(otherUser))).thenReturn(Optional.of(otherUsersPersonalSchedule));

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules?id=13"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(PersonalScheduleRepository, times(1)).findByIdAndUser(13L, u);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 13 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void api_PersonalSchedules__admin_logged_in__search_for_PersonalSchedule_that_belongs_to_another_user() throws Exception {

        // arrange

        User u = currentUserService.getCurrentUser().getUser();
        User otherUser = User.builder().id(999L).build();
        PersonalSchedule otherUsersPersonalSchedule = PersonalSchedule.builder()
                .name("name 1")
                .description("description 1")
                .quarter("quarter 1")
                .user(u)
                .id(27L)
                .build();

        when(PersonalScheduleRepository.findById(eq(27L))).thenReturn(Optional.of(otherUsersPersonalSchedule));

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules/admin?id=27"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(PersonalScheduleRepository, times(1)).findById(27L);
        String expectedJson = mapper.writeValueAsString(otherUsersPersonalSchedule);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void api_PersonalSchedules__admin_logged_in__search_for_PersonalSchedule_that_does_not_exist() throws Exception {

        // arrange

        when(PersonalScheduleRepository.findById(eq(29L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules/admin?id=29"))
                .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(PersonalScheduleRepository, times(1)).findById(29L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("PersonalSchedule with id 29 not found", json.get("message"));
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void api_PersonalSchedules_admin_all__admin_logged_in__returns_all_PersonalSchedules() throws Exception {

        // arrange

        User u1 = User.builder().id(1L).build();
        User u2 = User.builder().id(2L).build();
        User u = currentUserService.getCurrentUser().getUser();

        PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder()
                .name("name 1")
                .description("description 1")
                .quarter("quarter 1")
                .user(u1)
                .id(1L)
                .build();
        PersonalSchedule PersonalSchedule2 = PersonalSchedule.builder()
                .name("name 1")
                .description("description 1")
                .quarter("quarter 1")
                .user(u2)
                .id(2L)
                .build();
        PersonalSchedule PersonalSchedule3 = PersonalSchedule.builder()
                .name("name 1")
                .description("description 1")
                .quarter("quarter 1")
                .user(u)
                .id(3L)
                .build();

        ArrayList<PersonalSchedule> expectedPersonalSchedules = new ArrayList<>();
        expectedPersonalSchedules.addAll(Arrays.asList(PersonalSchedule1, PersonalSchedule2, PersonalSchedule3));

        when(PersonalScheduleRepository.findAll()).thenReturn(expectedPersonalSchedules);

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules/admin/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(PersonalScheduleRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedPersonalSchedules);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_PersonalSchedules_all__user_logged_in__returns_only_PersonalSchedules_for_user() throws Exception {

        // arrange

        User thisUser = currentUserService.getCurrentUser().getUser();

        PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder()
                .name("name 1")
                .description("description 1")
                .quarter("quarter 1")
                .user(thisUser)
                .id(1L)
                .build();
        PersonalSchedule PersonalSchedule2 = PersonalSchedule.builder()
                .name("name 1")
                .description("description 1")
                .quarter("quarter 1")
                .user(thisUser)
                .id(2L)
                .build();

        ArrayList<PersonalSchedule> expectedPersonalSchedules = new ArrayList<>();
        expectedPersonalSchedules.addAll(Arrays.asList(PersonalSchedule1, PersonalSchedule2));
        when(PersonalScheduleRepository.findAllByUserId(thisUser.getId())).thenReturn(expectedPersonalSchedules);

        // act
        MvcResult response = mockMvc.perform(get("/api/personalschedules/all"))
                .andExpect(status().isOk()).andReturn();

        // assert

        verify(PersonalScheduleRepository, times(1)).findAllByUserId(eq(thisUser.getId()));
        String expectedJson = mapper.writeValueAsString(expectedPersonalSchedules);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_PersonalSchedules_post__user_logged_in() throws Exception {
        // arrange

        User u = currentUserService.getCurrentUser().getUser();

        PersonalSchedule expectedPersonalSchedule = PersonalSchedule.builder()
                .name("Test Name")
                .description("Test Description")
                .quarter("Test Quarter")
                .user(u)
                .id(0L)
                .build();

        when(PersonalScheduleRepository.save(eq(expectedPersonalSchedule))).thenReturn(expectedPersonalSchedule);

        // act
        MvcResult response = mockMvc.perform(
                post("/api/personalschedules/post?name=Test Name&description=Test Description&quarter=Test Quarter")
                        .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        // assert
        verify(PersonalScheduleRepository, times(1)).save(expectedPersonalSchedule);
        String expectedJson = mapper.writeValueAsString(expectedPersonalSchedule);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    // @WithMockUser(roles = { "USER" })
    // @Test
    // public void api_PersonalSchedules__user_logged_in__delete_PersonalSchedule() throws Exception {
    //     // arrange

    //     User u = currentUserService.getCurrentUser().getUser();
    //     PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder().title("PersonalSchedule 1").details("PersonalSchedule 1").done(false).user(u).id(15L).build();
    //     when(PersonalScheduleRepository.findByIdAndUser(eq(15L), eq(u))).thenReturn(Optional.of(PersonalSchedule1));

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             delete("/api/PersonalSchedules?id=15")
    //                     .with(csrf()))
    //             .andExpect(status().isOk()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findByIdAndUser(15L, u);
    //     verify(PersonalScheduleRepository, times(1)).delete(PersonalSchedule1);
    //     Map<String, Object> json = responseToJson(response);
    //     assertEquals("PersonalSchedule with id 15 deleted", json.get("message"));
    // }

    // @WithMockUser(roles = { "USER" })
    // @Test
    // public void api_PersonalSchedules__user_logged_in__delete_PersonalSchedule_that_does_not_exist() throws Exception {
    //     // arrange

    //     User u = currentUserService.getCurrentUser().getUser();
    //     User otherUser = User.builder().id(98L).build();
    //     PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder().title("PersonalSchedule 1").details("PersonalSchedule 1").done(false).user(otherUser).id(15L).build();
    //     when(PersonalScheduleRepository.findByIdAndUser(eq(15L), eq(otherUser))).thenReturn(Optional.of(PersonalSchedule1));

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             delete("/api/PersonalSchedules?id=15")
    //                     .with(csrf()))
    //             .andExpect(status().isNotFound()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findByIdAndUser(15L, u);
    //     Map<String, Object> json = responseToJson(response);
    //     assertEquals("PersonalSchedule with id 15 not found", json.get("message"));
    // }

    // @WithMockUser(roles = { "USER" })
    // @Test
    // public void api_PersonalSchedules__user_logged_in__cannot_delete_PersonalSchedule_belonging_to_another_user() throws Exception {
    //     // arrange
    //     User u = currentUserService.getCurrentUser().getUser();
    //     User otherUser = User.builder().id(98L).build();
    //     PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder().title("PersonalSchedule 1").details("PersonalSchedule 1").done(false).user(otherUser).id(31L).build();
    //     when(PersonalScheduleRepository.findById(eq(31L))).thenReturn(Optional.of(PersonalSchedule1));

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             delete("/api/PersonalSchedules?id=31")
    //                     .with(csrf()))
    //             .andExpect(status().isNotFound()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findByIdAndUser(31L, u);
    //     Map<String, Object> json = responseToJson(response);
    //     assertEquals("PersonalSchedule with id 31 not found", json.get("message"));
    // }


    // @WithMockUser(roles = { "ADMIN", "USER" })
    // @Test
    // public void api_PersonalSchedules__admin_logged_in__delete_PersonalSchedule() throws Exception {
    //     // arrange

    //     User otherUser = User.builder().id(98L).build();
    //     PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder().title("PersonalSchedule 1").details("PersonalSchedule 1").done(false).user(otherUser).id(16L).build();
    //     when(PersonalScheduleRepository.findById(eq(16L))).thenReturn(Optional.of(PersonalSchedule1));

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             delete("/api/PersonalSchedules/admin?id=16")
    //                     .with(csrf()))
    //             .andExpect(status().isOk()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findById(16L);
    //     verify(PersonalScheduleRepository, times(1)).delete(PersonalSchedule1);
    //     Map<String, Object> output = responseToJson(response);
    //     assertEquals("PersonalSchedule with id 16 deleted", output.get("message"));
    // }

    // @WithMockUser(roles = { "ADMIN", "USER" })
    // @Test
    // public void api_PersonalSchedules__admin_logged_in__cannot_delete_PersonalSchedule_that_does_not_exist() throws Exception {
    //     // arrange

    //     when(PersonalScheduleRepository.findById(eq(17L))).thenReturn(Optional.empty());

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             delete("/api/PersonalSchedules/admin?id=17")
    //                     .with(csrf()))
    //             .andExpect(status().isNotFound()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findById(17L);
    //     Map<String, Object> output = responseToJson(response);
    //     assertEquals("PersonalSchedule with id 17 not found", output.get("message"));
    // }

    // @WithMockUser(roles = { "USER" })
    // @Test
    // public void api_PersonalSchedules__user_logged_in__put_PersonalSchedule() throws Exception {
    //     // arrange

    //     User u = currentUserService.getCurrentUser().getUser();
    //     User otherUser = User.builder().id(999).build();
    //     PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder().title("PersonalSchedule 1").details("PersonalSchedule 1").done(false).user(u).id(67L).build();
    //     // We deliberately set the user information to another user
    //     // This should get ignored and overwritten with current user when PersonalSchedule is saved

    //     PersonalSchedule updatedPersonalSchedule = PersonalSchedule.builder().title("New Title").details("New Details").done(true).user(otherUser).id(67L).build();
    //     PersonalSchedule correctPersonalSchedule = PersonalSchedule.builder().title("New Title").details("New Details").done(true).user(u).id(67L).build();

    //     String requestBody = mapper.writeValueAsString(updatedPersonalSchedule);
    //     String expectedReturn = mapper.writeValueAsString(correctPersonalSchedule);

    //     when(PersonalScheduleRepository.findByIdAndUser(eq(67L), eq(u))).thenReturn(Optional.of(PersonalSchedule1));

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             put("/api/PersonalSchedules?id=67")
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .characterEncoding("utf-8")
    //                     .content(requestBody)
    //                     .with(csrf()))
    //             .andExpect(status().isOk()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findByIdAndUser(67L, u);
    //     verify(PersonalScheduleRepository, times(1)).save(correctPersonalSchedule); // should be saved with correct user
    //     String responseString = response.getResponse().getContentAsString();
    //     assertEquals(expectedReturn, responseString);
    // }

    // @WithMockUser(roles = { "USER" })
    // @Test
    // public void api_PersonalSchedules__user_logged_in__cannot_put_PersonalSchedule_that_does_not_exist() throws Exception {
    //     // arrange

    //     User u = currentUserService.getCurrentUser().getUser();
    //     PersonalSchedule updatedPersonalSchedule = PersonalSchedule.builder().title("New Title").details("New Details").done(true).id(67L).build();

    //     String requestBody = mapper.writeValueAsString(updatedPersonalSchedule);

    //     when(PersonalScheduleRepository.findByIdAndUser(eq(67L), eq(u))).thenReturn(Optional.empty());

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             put("/api/PersonalSchedules?id=67")
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .characterEncoding("utf-8")
    //                     .content(requestBody)
    //                     .with(csrf()))
    //             .andExpect(status().isNotFound()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findByIdAndUser(67L, u);
    //     Map<String, Object> output = responseToJson(response);
    //     assertEquals("PersonalSchedule with id 67 not found", output.get("message"));
    // }


    // @WithMockUser(roles = { "USER" })
    // @Test
    // public void api_PersonalSchedules__user_logged_in__cannot_put_PersonalSchedule_for_another_user() throws Exception {
    //     // arrange

    //     User u = currentUserService.getCurrentUser().getUser();
    //     User otherUser = User.builder().id(98L).build();
    //     PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder().title("PersonalSchedule 1").details("PersonalSchedule 1").done(false).user(otherUser).id(31L).build();
    //     PersonalSchedule updatedPersonalSchedule = PersonalSchedule.builder().title("New Title").details("New Details").done(true).id(31L).build();

    //     when(PersonalScheduleRepository.findByIdAndUser(eq(31L), eq(otherUser))).thenReturn(Optional.of(PersonalSchedule1));

    //     String requestBody = mapper.writeValueAsString(updatedPersonalSchedule);

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             put("/api/PersonalSchedules?id=31")
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .characterEncoding("utf-8")
    //                     .content(requestBody)
    //                     .with(csrf()))
    //             .andExpect(status().isNotFound()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findByIdAndUser(31L, u);
    //     Map<String, Object> json = responseToJson(response);
    //     assertEquals("EntityNotFoundException", json.get("type"));
    //     assertEquals("PersonalSchedule with id 31 not found", json.get("message"));
    // }


    // @WithMockUser(roles = { "ADMIN", "USER" })
    // @Test
    // public void api_PersonalSchedules__admin_logged_in__put_PersonalSchedule() throws Exception {
    //     // arrange

    //     User otherUser = User.builder().id(255L).build();
    //     PersonalSchedule PersonalSchedule1 = PersonalSchedule.builder().title("PersonalSchedule 1").details("PersonalSchedule 1").done(false).user(otherUser).id(77L).build();
    //     User yetAnotherUser = User.builder().id(512L).build();
    //     // We deliberately put the wrong user on the updated PersonalSchedule
    //     // We expect the controller to ignore this and keep the user the same
    //     PersonalSchedule updatedPersonalSchedule = PersonalSchedule.builder().title("New Title").details("New Details").done(true).user(yetAnotherUser).id(77L)
    //             .build();
    //     PersonalSchedule correctPersonalSchedule = PersonalSchedule.builder().title("New Title").details("New Details").done(true).user(otherUser).id(77L)
    //             .build();

    //     String requestBody = mapper.writeValueAsString(updatedPersonalSchedule);
    //     String expectedJson = mapper.writeValueAsString(correctPersonalSchedule);

    //     when(PersonalScheduleRepository.findById(eq(77L))).thenReturn(Optional.of(PersonalSchedule1));

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             put("/api/PersonalSchedules/admin?id=77")
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .characterEncoding("utf-8")
    //                     .content(requestBody)
    //                     .with(csrf()))
    //             .andExpect(status().isOk()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findById(77L);
    //     verify(PersonalScheduleRepository, times(1)).save(correctPersonalSchedule);
    //     String responseString = response.getResponse().getContentAsString();
    //     assertEquals(expectedJson, responseString);
    // }

    // @WithMockUser(roles = { "ADMIN", "USER" })
    // @Test
    // public void api_PersonalSchedules__admin_logged_in__cannot_put_PersonalSchedule_that_does_not_exist() throws Exception {
    //     // arrange

    //     User otherUser = User.builder().id(345L).build();
    //     PersonalSchedule updatedPersonalSchedule = PersonalSchedule.builder().title("New Title").details("New Details").done(true).user(otherUser).id(77L)
    //             .build();

    //     String requestBody = mapper.writeValueAsString(updatedPersonalSchedule);

    //     when(PersonalScheduleRepository.findById(eq(77L))).thenReturn(Optional.empty());

    //     // act
    //     MvcResult response = mockMvc.perform(
    //             put("/api/PersonalSchedules/admin?id=77")
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .characterEncoding("utf-8")
    //                     .content(requestBody)
    //                     .with(csrf()))
    //             .andExpect(status().isNotFound()).andReturn();

    //     // assert
    //     verify(PersonalScheduleRepository, times(1)).findById(77L);
    //     Map<String, Object> json = responseToJson(response);
    //     assertEquals("EntityNotFoundException", json.get("type"));
    //     assertEquals("PersonalSchedule with id 77 not found", json.get("message"));
    // }

}