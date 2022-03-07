package edu.ucsb.cs156.example.services;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import edu.ucsb.cs156.example.entities.UCSBSubject;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;

import org.springframework.beans.factory.annotation.Value;

@RestClientTest(UCSBSubjectsService.class)
public class UCSBSubjectsServiceTests {

    @Autowired
    private MockRestServiceServer mockRestServiceServer;

    @Autowired
    private UCSBSubjectsService ucsbSubjectService;

    @Value("${app.ucsb.api.key}") private String ucsbApiKey;

    ObjectMapper mapper = new ObjectMapper();

    @Test
    public void test_getJSON() {

        String expectedURL = UCSBSubjectsService.ENDPOINT;
        String fakeJsonResult = "{ \"fake\" : \"result\" }";

        this.mockRestServiceServer.expect(requestTo(expectedURL))
                .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("ucsb-api-key", this.ucsbApiKey))
                .andExpect(header("ucsb-api-version", "1.6"))
                .andRespond(withSuccess(fakeJsonResult, MediaType.APPLICATION_JSON));

        String actualResult = ucsbSubjectService.getJSON();
        assertEquals(fakeJsonResult, actualResult);
    }

    @Test
    public void test_get() throws JsonProcessingException{

        String expectedURL = UCSBSubjectsService.ENDPOINT;
        String JsonResult = """
                [{
                \"subjectCode\": \"ANTH\",
                \"subjectTranslation\": \"Anthropology\",
                \"deptCode\": \"ANTH\",
                \"collegeCode\": \"L&S\",
                \"relatedDeptCode\": null,
                \"inactive\": false
                },
                {
                \"subjectCode\": \"ART  CS\",
                \"subjectTranslation\": \"Art (Creative Studies)\",
                \"deptCode\": \"CRSTU\",
                \"collegeCode\": \"CRST\",
                \"relatedDeptCode\": null,
                \"inactive\": false
                },
                {
                \"subjectCode\": \"ARTHI\",
                \"subjectTranslation\": \"Art History\",
                \"deptCode\": \"ARTHI\",
                \"collegeCode\": \"L&S\",
                \"relatedDeptCode\": null,
                \"inactive\": false
                }
                ];
        """;

        this.mockRestServiceServer.expect(requestTo(expectedURL))
                .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("ucsb-api-key", this.ucsbApiKey))
                .andExpect(header("ucsb-api-version", "1.6"))
                .andRespond(withSuccess(JsonResult, MediaType.APPLICATION_JSON));

        UCSBSubject us1 = UCSBSubject.builder()
                .subjectCode("ANTH")
                .subjectTranslation("Anthropology")
                .deptCode("ANTH")
                .collegeCode("L&S")
                .relatedDeptCode(null)
                .inactive(false)
                .build();

        UCSBSubject us2 = UCSBSubject.builder()
                .subjectCode("ART  CS")
                .subjectTranslation("Art (Creative Studies)")
                .deptCode("CRSTU")
                .collegeCode("CRST")
                .relatedDeptCode(null)
                .inactive(false)
                .build();

        UCSBSubject us3 = UCSBSubject.builder()
                .subjectCode("ARTHI")
                .subjectTranslation("Art History")
                .deptCode("ARTHI")
                .collegeCode("L&S")
                .relatedDeptCode(null)
                .inactive(false)
                .build();

        List<UCSBSubject> expectedUSs = new ArrayList<>();
        expectedUSs.addAll(Arrays.asList(us1, us2, us3));
        
        List<UCSBSubject> actualResult = ucsbSubjectService.get();

        assertEquals(expectedUSs, actualResult);
    }
}
