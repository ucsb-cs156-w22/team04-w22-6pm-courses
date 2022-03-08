package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.PersonalSchedule;
import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.models.CurrentUser;
import edu.ucsb.cs156.example.repositories.PersonalScheduleRepository;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Optional;

@Api(description = "API to handle CRUD operations for Personal Schedules database")
@RequestMapping("/api/personalschedules")
@RestController
@Slf4j
public class PersonalSchedulesController extends ApiController {

    @Autowired
    PersonalScheduleRepository personalScheduleRepository;

    @ApiOperation(value = "List all personal schedules")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin/all")
    public Iterable<PersonalSchedule> allUsersPersonalSchedules() {
        Iterable<PersonalSchedule> personalSchedules = personalScheduleRepository.findAll();
        return personalSchedules;
    }

    @ApiOperation(value = "List this user's personal schedules")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<PersonalSchedule> thisUsersPersonalSchedules() {
        CurrentUser currentUser = getCurrentUser();
        Iterable<PersonalSchedule> personalSchedules = personalScheduleRepository.findAllByUserId(currentUser.getUser().getId());
        return personalSchedules;
    }

    @ApiOperation(value = "Get a single personal schedule (if it belongs to current user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public PersonalSchedule getPersonalScheduleById(
            @ApiParam("id") @RequestParam Long id) {
        User currentUser = getCurrentUser().getUser();
        PersonalSchedule personalSchedule = personalScheduleRepository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        return personalSchedule;
    }

    @ApiOperation(value = "Get a single personal schedule (no matter who it belongs to, admin only)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/admin")
    public PersonalSchedule getPersonalScheduleById_admin(
            @ApiParam("id") @RequestParam Long id) {
        PersonalSchedule personalSchedule = personalScheduleRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        return personalSchedule;
    }

    @ApiOperation(value = "Create a new personal schedule")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/post")
    public PersonalSchedule postPersonalSchedule(
            @ApiParam("name") @RequestParam String name,
            @ApiParam("description") @RequestParam String description,
            @ApiParam("quarter") @RequestParam String quarter) {
        CurrentUser currentUser = getCurrentUser();
        log.info("currentUser={}", currentUser);

        PersonalSchedule personalSchedule = new PersonalSchedule();
        personalSchedule.setUser(currentUser.getUser());
        personalSchedule.setName(name);
        personalSchedule.setDescription(description);
        personalSchedule.setQuarter(quarter);
        PersonalSchedule savedPersonalSchedule = personalScheduleRepository.save(personalSchedule);
        return savedPersonalSchedule;
    }

    @ApiOperation(value = "Delete a personal schedule owned by this user")
    @PreAuthorize("hasRole('ROLE_USER')")
    @DeleteMapping("")
    public Object deletePersonalSchedule(
            @ApiParam("id") @RequestParam Long id) {
        User currentUser = getCurrentUser().getUser();
        PersonalSchedule personalSchedule = personalScheduleRepository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        personalScheduleRepository.delete(personalSchedule);

        return genericMessage("PersonalSchedule with id %s deleted".formatted(id));

    }

    @ApiOperation(value = "Delete another user's personal schedule")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/admin")
    public Object deletePersonalSchedule_Admin(
            @ApiParam("id") @RequestParam Long id) {
        PersonalSchedule personalSchedule = personalScheduleRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        personalScheduleRepository.delete(personalSchedule);

        return genericMessage("PersonalSchedule with id %s deleted".formatted(id));
    }

    @ApiOperation(value = "Update a single personal schedule (if it belongs to current user)")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("")
    public PersonalSchedule putPersonalScheduleById(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid PersonalSchedule incomingPersonalSchedule) {
        User currentUser = getCurrentUser().getUser();
        PersonalSchedule personalSchedule = personalScheduleRepository.findByIdAndUser(id, currentUser)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        personalSchedule.setName(incomingPersonalSchedule.getName());
        personalSchedule.setDescription(incomingPersonalSchedule.getDescription());
        personalSchedule.setQuarter(incomingPersonalSchedule.getQuarter());

        personalScheduleRepository.save(personalSchedule);

        return personalSchedule;
    }

    @ApiOperation(value = "Update a single personal schedule (regardless of ownership, admin only, can't change ownership)")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/admin")
    public PersonalSchedule putPersonalScheduleById_admin(
            @ApiParam("id") @RequestParam Long id,
            @RequestBody @Valid PersonalSchedule incomingPersonalSchedule) {
        PersonalSchedule personalSchedule = personalScheduleRepository.findById(id)
          .orElseThrow(() -> new EntityNotFoundException(PersonalSchedule.class, id));

        personalSchedule.setName(incomingPersonalSchedule.getName());
        personalSchedule.setDescription(incomingPersonalSchedule.getDescription());
        personalSchedule.setQuarter(incomingPersonalSchedule.getQuarter());

        personalScheduleRepository.save(personalSchedule);

        return personalSchedule;
    }


}