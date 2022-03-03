package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.documents.CourseSearchParams;
import edu.ucsb.cs156.example.services.UCSBCurriculumService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Api(description = "API to search the UCSB courses API")
@RequestMapping("/api/ucsbcourses")
@RestController
public class UCSBCurriculumController extends ApiController {

    @Autowired
    UCSBCurriculumService ucsbCurriculumService;

    @ApiOperation(value = "Run a course search with sensible defaults")
    @GetMapping("/search")
    public String courseSearch(
        @ApiParam("quarter")              @RequestParam(required = true ) String quarter,
        @ApiParam("courseId")             @RequestParam(required = false) String courseId,
        @ApiParam("enrollCode")           @RequestParam(required = false) String enrollCode,
        @ApiParam("session")              @RequestParam(required = false) String session,
        @ApiParam("subjectCode")          @RequestParam(required = false) String subjectCode,
        @ApiParam("deptCode")             @RequestParam(required = false) String deptCode,
        @ApiParam("objLevelCode")         @RequestParam(required = false) String objLevelCode,
        @ApiParam("title")                @RequestParam(required = false) String title,
        @ApiParam("areas")                @RequestParam(required = false) String areas,
        @ApiParam("openSections")         @RequestParam(required = false) Boolean openSections,
        @ApiParam("nonRestriction")       @RequestParam(required = false) Boolean nonRestriction,
        @ApiParam("nonPreReq")            @RequestParam(required = false) Boolean nonPreReq,
        @ApiParam("minUnits")             @RequestParam(required = false) Double minUnits,
        @ApiParam("maxUnits")             @RequestParam(required = false) Double maxUnits,
        @ApiParam("minStartTime")         @RequestParam(required = false) Integer minStartTime,
        @ApiParam("maxStartTime")         @RequestParam(required = false) Integer maxStartTime,
        @ApiParam("days")                 @RequestParam(required = false) String days,
        @ApiParam("instructor")           @RequestParam(required = false) String instructor,
        @ApiParam("pageNumber")           @RequestParam(required = false, defaultValue = "1") Integer pageNumber,
        @ApiParam("pageSize")             @RequestParam(required = false, defaultValue = "100") Integer pageSize,
        @ApiParam("includeClassSections") @RequestParam(required = false, defaultValue = "true") Boolean includeClassSections
    ) {
        // Create a course search params object
        CourseSearchParams csp = new CourseSearchParams(quarter);
        csp.courseId = courseId;
        csp.enrollCode = enrollCode;
        csp.session = session;
        csp.subjectCode = subjectCode;
        csp.deptCode = deptCode;
        csp.objLevelCode = objLevelCode;
        csp.title = title;
        csp.areas = areas;
        csp.openSections = openSections;
        csp.nonRestriction = nonRestriction;
        csp.nonPreReq = nonPreReq;
        csp.minUnits = minUnits;
        csp.maxUnits = maxUnits;
        csp.minStartTime = minStartTime;
        csp.maxStartTime = maxStartTime;
        csp.days = days;
        csp.instructor = instructor;
        csp.pageNumber = pageNumber;
        csp.pageSize = pageSize;
        csp.includeClassSections = includeClassSections;

        log.info(csp.generateParams());

        return ucsbCurriculumService.courseSearchAdvanced(csp);
    }

}