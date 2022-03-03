package edu.ucsb.cs156.example.services;

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
                .andRespond(withSuccess(fakeJsonResult, MediaType.APPLICATION_JSON));

        String actualResult = ucsbSubjectService.getJSON();
        log.info(actualResult);
        assertEquals(fakeJsonResult, actualResult);
    }

    @Test
    public void test_get() {

        String expectedURL = UCSBSubjectsService.ENDPOINT;
        String JsonResult = "{ \"fake\" : \"result\" }";

        this.mockRestServiceServer.expect(requestTo(expectedURL))
                .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
                .andExpect(header("ucsb-api-key", this.ucsbApiKey))
                .andRespond(withSuccess(JsonResult, MediaType.APPLICATION_JSON));
        
        List<UCSBSubject> fakeResult = new ArrayList<>();
        try {
                UCSBSubject[] subjects = mapper.readValue(JsonResult, UCSBSubject[].class);
                fakeResult = new ArrayList(Arrays.asList(subjects));
        }catch (Exception e) {
                e.printStackTrace();
        }

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
                .subjectCode("CH E")
                .subjectTranslation("Chemical Engineering")
                .deptCode("CNENG")
                .collegeCode("ENGR")
                .relatedDeptCode(null)
                .inactive(false)
                .build();

        List<UCSBSubject> expectedUSs = new ArrayList<>();
        List<UCSBSubject> actualResult = ucsbSubjectService.get();

        expectedUSs.addAll(Arrays.asList(us1, us2, us3));

        assertEquals(expectedUSs, actualResult);
        assertEquals(fakeResult.size(), actualResult.size());
        assertEquals(fakeResult, actualResult);
    }
}
