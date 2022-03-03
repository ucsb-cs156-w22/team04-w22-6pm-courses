package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.UCSBCurriculumService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.documents.CourseSearchParams;
import edu.ucsb.cs156.example.entities.User;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatcher;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.client.RestTemplate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.mockito.ArgumentMatchers.any;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

@WebMvcTest(controllers = UCSBCurriculumController.class)
@Import(TestConfig.class)
public class UCSBCurriculumControllerTests extends ControllerTestCase {

    @MockBean
    UserRepository userRepository;

    @MockBean
    UCSBCurriculumService ucsbCurriculumService;

    @Mock
    private RestTemplate restTemplate;

    @Test
    public void api_search_test() throws Exception {

        String expectedResult = "{expectedResult}";

        when(ucsbCurriculumService.courseSearchAdvanced(any())).thenReturn(expectedResult);

        CourseSearchParams csp = new CourseSearchParams("20222");

        csp.quarter = "test";
        csp.courseId = "test";
        csp.enrollCode = "test";
        csp.session = "test";
        csp.deptCode = "";
        csp.objLevelCode = "test";
        csp.title = "test";
        csp.areas = "test";
        csp.objLevelCode = "A"; 
        csp.openSections = true;
        csp.nonRestriction = true;
        csp.nonPreReq = true;
        csp.minUnits = 2.0;
        csp.maxUnits = 2.0;
        csp.minStartTime = 1;
        csp.maxStartTime = 1;
        csp.days = "";
        csp.instructor = "";
        csp.pageNumber = 1;
        csp.pageSize = 100;
        csp.includeClassSections = true;

        assertEquals(csp.generateParams(), "?quarter=test&courseId=test&enrollCode=test&session=test&deptCode=&objLevelCode=A&title=test&areas=test&openSections=true&nonRestriction=true&nonPreReq=true&minUnits=2.000000&maxUnits=2.000000&minStartTime=1&maxStartTime=1&days=&instructor=&pageNumber=1&pageSize=100&includeClassSections=true");

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsbcourses/search" + csp.generateParams()))
                .andExpect(status().isOk()).andReturn();

        // assert
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedResult, responseString);
    }
}