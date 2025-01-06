package com.example.ExpenseTracker.Controller;

import com.example.ExpenseTracker.Entity.*;
import com.example.ExpenseTracker.Service.ExcelService;
import com.example.ExpenseTracker.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/excel")
public class ExcelController {
    
    @Autowired
    private ExcelService excelService;
    
    @Autowired
    private IncomeRepository incomeRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> importExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam("incomeLocations") List<String> incomeLocations,
            @RequestParam("expenseLocations") List<String> expenseLocations) {
        try {
            Map<String, Object> result = excelService.importExcelData(file, incomeLocations, expenseLocations);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/income")
    public ResponseEntity<List<Income>> getIncome() {
        return new ResponseEntity<>(incomeRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/expense")
    public ResponseEntity<List<Expense>> getExpense() {
        return new ResponseEntity<>(expenseRepository.findAll(), HttpStatus.OK);
    }
}