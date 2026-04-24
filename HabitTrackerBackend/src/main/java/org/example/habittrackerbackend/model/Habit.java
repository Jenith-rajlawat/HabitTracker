package org.example.habittrackerbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity //Tells Spring Data JPA that this class  represents a table in your db
public class Habit {
    //id(long), name(string), xp(int), lastCOmpleted(localDate), streak(int)

    @Id //Marks a specific field as primary key in table
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Instructs the db to automatically generate a value for the id whenever a new record is created. Generation Type Identity specifically tells the app to rely on db's own auto increment feature for ids
    private Long id;
    private String name;
    private int xp;
    private int streak;
    private LocalDate lastCompleted;

    public Habit() {
    } //default constructor

    public Habit(Long id, String name, int xp, int streak, LocalDate lastCompleted) {
        this.id = id;
        this.name = name;
        this.xp = xp;
        this.streak = streak;
        this.lastCompleted = lastCompleted;
    } //parameterized constructor

    //getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    public int getStreak() {
        return streak;
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }

    public LocalDate getLastCompleted() {
        return lastCompleted;
    }

    public void setLastCompleted(LocalDate lastCompleted) {
        this.lastCompleted = lastCompleted;
    }
}
