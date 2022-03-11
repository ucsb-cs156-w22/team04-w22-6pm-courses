package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.services.UCSBSubjectsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(description = "API to handle CRUD operations for UCSB Subjects database")
@RequestMapping("/api/UCSBSubjects")
@RestController
public class UCSBSubjectsController extends ApiController {

    @Autowired
    UCSBSubjectsService ucsbSubjectsService;

    @ApiOperation(value = "Get all UCSB Subjects")
    @PreAuthorize("hasRole('ROLE_USER') || hasRole('ROLE_ADMIN')")
    @GetMapping("/all")
    public String allSubjects() {
        return ucsbSubjectsService.getJSON();
    }
}