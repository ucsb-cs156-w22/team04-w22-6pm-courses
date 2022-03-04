package edu.ucsb.cs156.example.services;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import edu.ucsb.cs156.example.documents.CourseSearchParams;
import lombok.extern.slf4j.Slf4j;

/**
 * Service object that wraps the UCSB Academic Curriculum API
 */
@Slf4j
@Service
public class UCSBCurriculumService  {

    @Value("${app.ucsb.api.key}")
    private String apiKey;

    private RestTemplate restTemplate = new RestTemplate();

    public String courseSearchAdvanced(CourseSearchParams searchParams) {

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("ucsb-api-version", "1.0");
        headers.set("ucsb-api-key", this.apiKey);

        HttpEntity<String> entity = new HttpEntity<>("body", headers);

        String uri = "https://api.ucsb.edu/academics/curriculums/v1/classes/search";
        String params = searchParams.generateParams();
        String url = uri + params;

        log.info("url=" + url);

        String retVal = "";
        try {
            ResponseEntity<String> re = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            retVal = re.getBody();
        } catch (HttpClientErrorException e) {
            retVal = "{\"error\": \"401: Unauthorized\"}";
        }
        return retVal;
    }
}