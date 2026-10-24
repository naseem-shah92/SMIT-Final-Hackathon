/**
 * CSV Parser with rigorous dry-run validation for employee bulk onboarding.
 * Checks:
 * - Required fields (code, name, email, department, designation, basic_salary, joining_date)
 * - Unique code & unique email
 * - Valid email format
 * - Known department
 * - ISO date format (YYYY-MM-DD)
 * - Basic salary > 0
 */
export function parseAndValidateEmployeeCSV(csvContent, existingEmployees = [], knownDepartments = []) {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) {
    return {
      totalRows: 0,
      validRows: [],
      errors: [{ row: 0, field: 'file', reason: 'CSV file is empty or missing headers' }]
    };
  }

  const rawHeaders = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  const headerMap = {};
  rawHeaders.forEach((h, idx) => {
    headerMap[h] = idx;
  });

  const requiredFields = ['code', 'name', 'email', 'department', 'designation', 'basic_salary', 'joining_date'];
  for (const field of requiredFields) {
    if (headerMap[field] === undefined) {
      return {
        totalRows: 0,
        validRows: [],
        errors: [{ row: 1, field, reason: `Missing required column header: '${field}'` }]
      };
    }
  }

  const existingCodes = new Set(existingEmployees.map(e => String(e.code || '').toLowerCase()));
  const existingEmails = new Set(existingEmployees.map(e => String(e.email || '').toLowerCase()));
  const deptLookup = new Set(knownDepartments.map(d => String(d.name || d.code || d).toLowerCase()));

  const seenCodes = new Set();
  const seenEmails = new Set();
  const validRows = [];
  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  for (let i = 1; i < lines.length; i++) {
    const rowNumber = i + 1;
    const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    
    // Skip empty lines
    if (values.every(v => v === '')) continue;

    const rowData = {
      code: values[headerMap['code']] || '',
      name: values[headerMap['name']] || '',
      email: values[headerMap['email']] || '',
      department: values[headerMap['department']] || '',
      designation: values[headerMap['designation']] || '',
      basic_salary: Number(values[headerMap['basic_salary']]) || 0,
      joining_date: values[headerMap['joining_date']] || '',
      phone: headerMap['phone'] !== undefined ? values[headerMap['phone']] : '',
      address: headerMap['address'] !== undefined ? values[headerMap['address']] : ''
    };

    let rowHasError = false;

    // 1. Required fields check
    for (const req of requiredFields) {
      if (!rowData[req] || (typeof rowData[req] === 'string' && !rowData[req].trim())) {
        errors.push({ row: rowNumber, field: req, reason: `${req} is required and cannot be empty` });
        rowHasError = true;
      }
    }

    // 2. Code uniqueness check
    const codeLower = rowData.code.toLowerCase();
    if (existingCodes.has(codeLower) || seenCodes.has(codeLower)) {
      errors.push({ row: rowNumber, field: 'code', reason: `Employee code '${rowData.code}' already exists` });
      rowHasError = true;
    } else if (rowData.code) {
      seenCodes.add(codeLower);
    }

    // 3. Email uniqueness & format check
    const emailLower = rowData.email.toLowerCase();
    if (!emailRegex.test(rowData.email)) {
      errors.push({ row: rowNumber, field: 'email', reason: `Invalid email address format: '${rowData.email}'` });
      rowHasError = true;
    } else if (existingEmails.has(emailLower) || seenEmails.has(emailLower)) {
      errors.push({ row: rowNumber, field: 'email', reason: `Email address '${rowData.email}' is already registered` });
      rowHasError = true;
    } else {
      seenEmails.add(emailLower);
    }

    // 4. Known department check
    if (deptLookup.size > 0 && rowData.department && !deptLookup.has(rowData.department.toLowerCase())) {
      errors.push({ row: rowNumber, field: 'department', reason: `Unknown department '${rowData.department}'` });
      rowHasError = true;
    }

    // 5. ISO date check
    if (rowData.joining_date && !isoDateRegex.test(rowData.joining_date)) {
      errors.push({ row: rowNumber, field: 'joining_date', reason: `Date must be in ISO YYYY-MM-DD format (got: '${rowData.joining_date}')` });
      rowHasError = true;
    }

    // 6. Basic salary > 0
    if (rowData.basic_salary <= 0) {
      errors.push({ row: rowNumber, field: 'basic_salary', reason: `Basic salary must be greater than 0 (got: ${rowData.basic_salary})` });
      rowHasError = true;
    }

    if (!rowHasError) {
      validRows.push(rowData);
    }
  }

  return {
    totalRows: lines.length - 1,
    validRowsCount: validRows.length,
    errorCount: errors.length,
    validRows,
    errors
  };
}
