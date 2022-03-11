package edu.ucsb.cs156.example.services;

import java.util.Arrays;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.beans.factory.annotation.Value;

@Service("UCSBSubjects")
public class UCSBSubjectsService {

        @Value("${app.ucsb.api.key}") private String ucsbApiKey;

        private RestTemplate restTemplate = new RestTemplate();

        public static final String ENDPOINT = "https://api.ucsb.edu/students/lookups/v1/subjects?includeInactive=false";
        
        public String getJSON() throws HttpClientErrorException {
                HttpHeaders headers = new HttpHeaders();
                headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("ucsb-api-key", this.ucsbApiKey);
                headers.set("ucsb-api-version", "1.6");

                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<String> re = restTemplate.exchange(ENDPOINT, HttpMethod.GET, entity, String.class);
                return re.getBody();
        }
}