package edu.ucsb.cs156.example.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatcher;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestTemplate;

import edu.ucsb.cs156.example.documents.CourseSearchParams;

import org.springframework.web.client.HttpClientErrorException;

@ExtendWith(SpringExtension.class)
public class UCSBCurriculumServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private UCSBCurriculumService ucs;

    static class CorrectHeaderMatcher implements ArgumentMatcher<HttpEntity> {

        @Value("${app.ucsb.api.key}")
        private String apiKey;

        @Override
        public boolean matches(HttpEntity stub) {
            return 
                stub.getHeaders().get("ucsb-api-version").contains("1.0")
                && stub.getHeaders().get("ucsb-api-key").contains(this.apiKey)
                && stub.getHeaders().get("accept").contains(MediaType.APPLICATION_JSON.toString())
                && stub.getHeaders().get("content-type").contains(MediaType.APPLICATION_JSON.toString());
        }
        
    }

    @Test
    public void test_courseSearchAdvanced_success() throws Exception {
        String expectedResult = "{expectedResult}";

        when(restTemplate.exchange(any(String.class), eq(HttpMethod.GET), argThat(new CorrectHeaderMatcher()), eq(String.class)))
                .thenReturn(new ResponseEntity<String>(expectedResult, HttpStatus.OK));

        CourseSearchParams csp = new CourseSearchParams("20221");
        csp.subjectCode= "CMPSC";
        csp.objLevelCode = "L";

        String result = ucs.courseSearchAdvanced(csp);

        assertEquals(expectedResult, result);
    }

    @Test
    public void test_courseSearchAdvanced_exception() throws Exception {

        String expectedResult = "{\"error\": \"401: Unauthorized\"}";

        when(restTemplate.exchange(any(String.class), eq(HttpMethod.GET), argThat(new CorrectHeaderMatcher()), eq(String.class)))
                .thenThrow(HttpClientErrorException.class);


        CourseSearchParams csp = new CourseSearchParams("20221");
        csp.subjectCode= "CMPSC";
        csp.objLevelCode = "L";

        String result = ucs.courseSearchAdvanced(csp);

        assertEquals(expectedResult, result);
    }

}