package com.example.ExpenseTracker.Repository;

import com.example.ExpenseTracker.Entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense,Long> {
}