package edu.ucsb.cs156.example.services;

import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import edu.ucsb.cs156.example.entities.UCSBSubject;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import org.springframework.beans.factory.annotation.Value;

@Slf4j
@Service("UCSBSubjects")
public class UCSBSubjectsService {

        @Value("${app.ucsb.api.key}") private String ucsbApiKey;

        ObjectMapper mapper = new ObjectMapper();

        private RestTemplate restTemplate = new RestTemplate();

        public UCSBSubjectsService(RestTemplateBuilder restTemplateBuilder) {
                restTemplate = restTemplateBuilder.build();
        }

        public static final String ENDPOINT = "https://api.ucsb.edu/students/lookups/v1/subjects?includeInactive=false";
        
        public String getJSON() throws HttpClientErrorException {
                HttpHeaders headers = new HttpHeaders();
                headers.setAccept(List.of(MediaType.APPLICATION_JSON));
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("ucsb-api-key", this.ucsbApiKey);
                headers.set("ucsb-api-version", "1.6");

                HttpEntity<String> entity = new HttpEntity<>(headers);

                Map<String, String> uriVariables = Map.of("subjectCode", "", "subjectTranslation", "");

                ResponseEntity<String> re = restTemplate.exchange(ENDPOINT, HttpMethod.GET, entity, String.class,
                        uriVariables);
                return re.getBody();
        }

        public List<UCSBSubject> get() throws JsonProcessingException {

                List<UCSBSubject> subjectsList = new ArrayList<UCSBSubject>();
                
                String json = getJSON();
                // try {
                        UCSBSubject[] subjects = mapper.readValue(json, UCSBSubject[].class);
                        subjectsList = new ArrayList(Arrays.asList(subjects));
                        log.info("subjectsList={}",subjectsList);
                // }catch (Exception e) {
                //         log.error(e.toString());
                // }
                return subjectsList;
        }
}