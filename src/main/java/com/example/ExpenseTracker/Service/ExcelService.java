package com.example.ExpenseTracker.Service;

import com.example.ExpenseTracker.Entity.Expense;
import com.example.ExpenseTracker.Entity.Income;
import com.example.ExpenseTracker.Repository.ExpenseRepository;
import com.example.ExpenseTracker.Repository.IncomeRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class ExcelService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    public Map<String, Object> importExcelData(MultipartFile file, 
                                             List<String> incomeLocations, 
                                             List<String> expenseLocations) throws IOException {
        List<Income> incomeList = new ArrayList<>();
        List<Expense> expenseList = new ArrayList<>();
        Map<String, Object> result = new HashMap<>();
        double totalIncome = 0;
        double totalExpense = 0;

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                throw new IOException("Sheet not found in the Excel file.");
            }

            // Process Income Tables
            if (incomeLocations != null) {
                for (String location : incomeLocations) {
                    if (location != null && !location.trim().isEmpty()) {
                        System.out.println("Processing income table at location: " + location);
                        TableInfo tableInfo = processIncomeTable(sheet, location.trim());
                        incomeList.addAll(tableInfo.getIncomeList());
                        totalIncome += tableInfo.getTotal();
                    }
                }
            }

            // Process Expense Tables
            if (expenseLocations != null) {
                for (String location : expenseLocations) {
                    if (location != null && !location.trim().isEmpty()) {
                        System.out.println("Processing expense table at location: " + location);
                        TableInfo tableInfo = processExpenseTable(sheet, location.trim());
                        expenseList.addAll(tableInfo.getExpenseList());
                        totalExpense += tableInfo.getTotal();
                    }
                }
            }

            // Save to database
            if (!incomeList.isEmpty()) {
                incomeRepository.saveAll(incomeList);
            }
            if (!expenseList.isEmpty()) {
                expenseRepository.saveAll(expenseList);
            }
            
            if(incomeList.isEmpty() && expenseList.isEmpty()){
                throw new IOException("No tables were found at specified locations or the format is incorrect");
             }

            result.put("totalIncome", totalIncome);
            result.put("totalExpense", totalExpense);
            result.put("incomeList", incomeList);
            result.put("expenseList", expenseList);

            return result;
        }
    }

    private static class TableInfo {
        private final List<Income> incomeList = new ArrayList<>();
        private final List<Expense> expenseList = new ArrayList<>();
        private double total = 0;

        public List<Income> getIncomeList() {
            return incomeList;
        }

        public List<Expense> getExpenseList() {
            return expenseList;
        }

        public double getTotal() {
            return total;
        }

        public void addToTotal(double amount) {
            this.total += amount;
        }
    }

    private TableInfo processIncomeTable(Sheet sheet, String startCell) {
        TableInfo tableInfo = new TableInfo();
        int[] cellLocation = parseCellReference(startCell);
        int rowIndex = cellLocation[0];
        int colIndex = cellLocation[1];

        // Skip header row
        rowIndex++;

        while (true) {
            Row row = sheet.getRow(rowIndex);
            if (row == null || isRowEmpty(row, colIndex)) {
                break;
            }

            String date = getCellValueAsString(row.getCell(colIndex));
            String total = getCellValueAsString(row.getCell(colIndex + 1));
            String remark = getCellValueAsString(row.getCell(colIndex + 2));

            if (!date.isEmpty() && !total.isEmpty()) {
                Income income = new Income();
                income.setDate(date);
                income.setTotal(total);
                income.setRemark(remark);
                tableInfo.getIncomeList().add(income);

                try {
                    tableInfo.addToTotal(Double.parseDouble(total));
                } catch (NumberFormatException e) {
                    System.err.println("Invalid number format for income: " + total);
                }
            }

            rowIndex++;
        }

        return tableInfo;
    }

    private TableInfo processExpenseTable(Sheet sheet, String startCell) {
        TableInfo tableInfo = new TableInfo();
        int[] cellLocation = parseCellReference(startCell);
        int rowIndex = cellLocation[0];
        int colIndex = cellLocation[1];

        // Skip header row
        rowIndex++;

        while (true) {
            Row row = sheet.getRow(rowIndex);
            if (row == null || isRowEmpty(row, colIndex)) {
                break;
            }

            String type = getCellValueAsString(row.getCell(colIndex));
            String date = getCellValueAsString(row.getCell(colIndex + 1));
            String amount = getCellValueAsString(row.getCell(colIndex + 2));

            if (!date.isEmpty() && !amount.isEmpty()) {
                Expense expense = new Expense();
                expense.setType(type);
                expense.setDate(date);
                expense.setAmount(amount);
                tableInfo.getExpenseList().add(expense);

                try {
                    tableInfo.addToTotal(Double.parseDouble(amount));
                } catch (NumberFormatException e) {
                    System.err.println("Invalid number format for expense: " + amount);
                }
            }

            rowIndex++;
        }

        return tableInfo;
    }

    private int[] parseCellReference(String cellRef) {
        // Remove any non-letter characters to get the column reference
        String colRef = cellRef.replaceAll("[^A-Za-z]", "");
        // Remove any non-digit characters to get the row reference
        int rowRef = Integer.parseInt(cellRef.replaceAll("[^0-9]", "")) - 1;
        
        // Convert column reference to number (A=0, B=1, etc.)
        int colNum = 0;
        for (char c : colRef.toUpperCase().toCharArray()) {
            colNum = colNum * 26 + (c - 'A');
        }
        
        return new int[]{rowRef, colNum};
    }

    private boolean isRowEmpty(Row row, int startCol) {
        for (int i = startCol; i < startCol + 3; i++) {
            Cell cell = row.getCell(i);
            if (cell != null && !getCellValueAsString(cell).isEmpty()) {
                return false;
            }
        }
        return true;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return DATE_FORMAT.format(cell.getDateCellValue());
                }
                // Avoid scientific notation and trailing zeros
                double value = cell.getNumericCellValue();
                if (value == (long) value) {
                    return String.format("%d", (long) value);
                }
                return String.format("%.2f", value);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return String.valueOf(cell.getNumericCellValue());
                } catch (Exception e) {
                    return cell.getStringCellValue();
                }
            default:
                return "";
        }
    }
}