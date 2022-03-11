package edu.ucsb.cs156.example.services;

import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatcher;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import org.springframework.beans.factory.annotation.Value;

@RestClientTest(UCSBSubjectsService.class)
public class UCSBSubjectsServiceTests {

        @Mock
        private RestTemplate restTemplate;

        @InjectMocks
        private UCSBSubjectsService ucsbSubjectsService;

        static class CorrectHeaderMatcher implements ArgumentMatcher<HttpEntity> {

                @Value("${app.ucsb.api.key}")
                private String apiKey;

                @Override
                public boolean matches(HttpEntity stub) {
                return 
                        stub.getHeaders().get("ucsb-api-version").contains("1.6")
                        && stub.getHeaders().get("ucsb-api-key").contains(this.apiKey)
                        && stub.getHeaders().get("accept").contains(MediaType.APPLICATION_JSON.toString())
                        && stub.getHeaders().get("content-type").contains(MediaType.APPLICATION_JSON.toString());
                }
                
        }

        @Test
        public void test_getJSON_success_and_expected() throws Exception {
                String expectedResult = "{expectedResult}";

                when(restTemplate.exchange(any(String.class), eq(HttpMethod.GET), argThat(new CorrectHeaderMatcher()), eq(String.class)))
                        .thenReturn(new ResponseEntity<String>(expectedResult, HttpStatus.OK));

                String result = ucsbSubjectsService.getJSON();

                assertEquals(expectedResult, result);
        }
}