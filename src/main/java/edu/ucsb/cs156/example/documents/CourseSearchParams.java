package edu.ucsb.cs156.example.documents;

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
        return String.format("?quarter=%s", quarter)
            + (courseId != null ? String.format("&courseId=%s", courseId) : "")
            + (enrollCode != null ? String.format("&enrollCode=%s", enrollCode) : "")
            + (session != null ? String.format("&session=%s", session) : "")
            + (subjectCode != null ? String.format("&subjectCode=%s", subjectCode) : "")
            + (deptCode != null ? String.format("&deptCode=%s", deptCode) : "")
            + (objLevelCode != null ? String.format("&objLevelCode=%s", objLevelCode) : "")
            + (title != null ? String.format("&title=%s", title) : "")
            + (areas != null ? String.format("&areas=%s", areas) : "")
            + (openSections != null ? String.format("&openSections=%b", openSections) : "")
            + (nonRestriction != null ? String.format("&nonRestriction=%b", nonRestriction) : "")
            + (nonPreReq != null ? String.format("&nonPreReq=%b", nonPreReq) : "")
            + (minUnits != null ? String.format("&minUnits=%f", minUnits) : "")
            + (maxUnits != null ? String.format("&maxUnits=%f", maxUnits) : "")
            + (minStartTime != null ? String.format("&minStartTime=%d", minStartTime) : "")
            + (maxStartTime != null ? String.format("&maxStartTime=%d", maxStartTime) : "")
            + (days != null ? String.format("&days=%s", days) : "")
            + (instructor != null ? String.format("&instructor=%s", instructor) : "")
            + String.format("&pageNumber=%d", pageNumber)
            + String.format("&pageSize=%d", pageSize)
            + String.format("&includeClassSections=%b", includeClassSections);
    }
}
