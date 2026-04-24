package org.example.habittrackerbackend.repository;

import org.example.habittrackerbackend.model.Habit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitRepository extends JpaRepository<Habit,Long> {
}
