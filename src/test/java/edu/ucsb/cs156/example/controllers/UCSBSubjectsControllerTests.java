package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.UCSBSubjectsService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.client.RestTemplate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = UCSBSubjectsController.class)
@Import(TestConfig.class)
public class UCSBSubjectsControllerTests extends ControllerTestCase {

    @MockBean
    UserRepository userRepository;

    @MockBean
    UCSBSubjectsService ucsbSubjectsService;

    @Mock
    private RestTemplate restTemplate;


    @Test
    public void api_UCSBSubjects_all__logged_out__returns_403() throws Exception {
        mockMvc.perform(get("/api/UCSBSubjects/all"))
                .andExpect(status().is(403));
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_UCSBSubjects_all__user_logged_in__returns_200() throws Exception {
        mockMvc.perform(get("/api/UCSBSubjects/all"))
                .andExpect(status().isOk());
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_search_test() throws Exception {

        String expectedResult = "{expectedResult}";

        when(ucsbSubjectsService.getJSON()).thenReturn(expectedResult);

        // act
        MvcResult response = mockMvc.perform(get("/api/UCSBSubjects/all"))
                .andExpect(status().isOk()).andReturn();

        // assert
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedResult, responseString);
    }
}