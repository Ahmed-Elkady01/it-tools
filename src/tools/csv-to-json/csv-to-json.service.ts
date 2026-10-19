export type CsvToJsonResult =
  | { success: true; output: string }
  | { success: false; error: { code: 'unterminated-quote' | 'invalid-quote' | 'long-row'; row: number } };

export function convertCsvToJson({ csv }: { csv: string }): CsvToJsonResult {
  if (csv === '') {
    return { success: true, output: '' };
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let closedQuote = false;
  let rowStart = 0;

  for (let index = 0; index < csv.length; index++) {
    const character = csv[index];

    if (quoted) {
      if (character === '"') {
        if (csv[index + 1] === '"') {
          field += '"';
          index++;
        }
        else {
          quoted = false;
          closedQuote = true;
        }
      }
      else {
        field += character;
      }
      continue;
    }

    if (character === ',') {
      row.push(field);
      field = '';
      closedQuote = false;
    }
    else if (character === '\n' || character === '\r') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      closedQuote = false;
      if (character === '\r' && csv[index + 1] === '\n') {
        index++;
      }
      rowStart = index + 1;
    }
    else if (character === '"' && field === '' && !closedQuote) {
      quoted = true;
    }
    else if (character === '"' || closedQuote) {
      return { success: false, error: { code: 'invalid-quote', row: rows.length + 1 } };
    }
    else {
      field += character;
    }
  }

  if (quoted) {
    return { success: false, error: { code: 'unterminated-quote', row: rows.length + 1 } };
  }

  if (rowStart < csv.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  const longRowIndex = dataRows.findIndex(values => values.length > headers.length);
  if (longRowIndex !== -1) {
    return { success: false, error: { code: 'long-row', row: longRowIndex + 2 } };
  }

  const objects = dataRows.map(values => Object.fromEntries(
    headers.map((header, index) => [header, values[index] ?? '']),
  ));

  return { success: true, output: JSON.stringify(objects, null, 2) };
}
