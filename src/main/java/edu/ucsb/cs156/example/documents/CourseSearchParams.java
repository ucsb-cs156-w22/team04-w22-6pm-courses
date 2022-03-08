package edu.ucsb.cs156.example.documents;

import org.springframework.web.util.UriUtils;

public class CourseSearchParams {

    public CourseSearchParams(String quarter){
        this.quarter = quarter;
    }

    public String quarter;
    public String courseId;
    public String enrollCode;
    public String session;
    public String subjectCode;
    public String deptCode;
    public String objLevelCode;
    public String title;
    public String areas;
    public Boolean openSections;
    public Boolean nonRestriction;
    public Boolean nonPreReq;
    public Double minUnits;
    public Double maxUnits;
    public Integer minStartTime;
    public Integer maxStartTime;
    public String days;
    public String instructor;
    public Integer pageNumber = 1;
    public Integer pageSize = 100;
    public Boolean includeClassSections = true;

    public String generateParams(){
        return String.format("?quarter=%s", UriUtils.encode(quarter, "UTF-8"))
            + (courseId != null ? String.format("&courseId=%s", UriUtils.encode(courseId, "UTF-8")) : "")
            + (enrollCode != null ? String.format("&enrollCode=%s", UriUtils.encode(enrollCode, "UTF-8")) : "")
            + (session != null ? String.format("&session=%s", UriUtils.encode(session, "UTF-8")) : "")
            + (subjectCode != null ? String.format("&subjectCode=%s", UriUtils.encode(subjectCode, "UTF-8")) : "")
            + (deptCode != null ? String.format("&deptCode=%s", UriUtils.encode(deptCode, "UTF-8")) : "")
            + (objLevelCode != null ? String.format("&objLevelCode=%s", UriUtils.encode(objLevelCode, "UTF-8")) : "")
            + (title != null ? String.format("&title=%s", UriUtils.encode(title, "UTF-8")) : "")
            + (areas != null ? String.format("&areas=%s", UriUtils.encode(areas, "UTF-8")) : "")
            + (openSections != null ? String.format("&openSections=%s", UriUtils.encode(openSections.toString(), "UTF-8")) : "")
            + (nonRestriction != null ? String.format("&nonRestriction=%s", UriUtils.encode(nonRestriction.toString(), "UTF-8")) : "")
            + (nonPreReq != null ? String.format("&nonPreReq=%s", UriUtils.encode(nonPreReq.toString(), "UTF-8")) : "")
            + (minUnits != null ? String.format("&minUnits=%s", UriUtils.encode(minUnits.toString(), "UTF-8")) : "")
            + (maxUnits != null ? String.format("&maxUnits=%s", UriUtils.encode(maxUnits.toString(), "UTF-8")) : "")
            + (minStartTime != null ? String.format("&minStartTime=%s", UriUtils.encode(minStartTime.toString(), "UTF-8")) : "")
            + (maxStartTime != null ? String.format("&maxStartTime=%s", UriUtils.encode(maxStartTime.toString(), "UTF-8")) : "")
            + (days != null ? String.format("&days=%s", UriUtils.encode(days, "UTF-8")) : "")
            + (instructor != null ? String.format("&instructor=%s", UriUtils.encode(instructor, "UTF-8")) : "")
            + String.format("&pageNumber=%s", UriUtils.encode(pageNumber.toString(), "UTF-8"))
            + String.format("&pageSize=%s", UriUtils.encode(pageSize.toString(), "UTF-8"))
            + String.format("&includeClassSections=%s", UriUtils.encode(includeClassSections.toString(), "UTF-8"));
    }
}
