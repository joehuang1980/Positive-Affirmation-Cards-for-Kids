function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sync') || SpreadsheetApp.getActiveSpreadsheet().insertSheet('sync');
  if (sheet.getLastRow() === 0) sheet.appendRow(['familyKey', 'stateJson', 'updatedAt']);

  const action = (e.parameter.action || '').trim();
  const familyKey = (e.parameter.familyKey || '').trim();
  if (action !== 'load' || !familyKey) {
    return json_({ ok: false, message: 'Invalid request' });
  }

  const row = findRow_(sheet, familyKey);
  const stateJson = row > 0 ? String(sheet.getRange(row, 2).getValue() || '{}') : '{}';
  return json_({ ok: true, state: JSON.parse(stateJson) });
}

function doPost(e) {
  const body = JSON.parse((e.postData && e.postData.contents) || '{}');
  const action = (body.action || '').trim();
  const familyKey = (body.familyKey || '').trim();
  const state = body.state || {};

  if (action !== 'save' || !familyKey) {
    return json_({ ok: false, message: 'Invalid payload' });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sync') || SpreadsheetApp.getActiveSpreadsheet().insertSheet('sync');
  if (sheet.getLastRow() === 0) sheet.appendRow(['familyKey', 'stateJson', 'updatedAt']);

  const updatedAt = Date.now();
  state.updatedAt = updatedAt;
  const row = findRow_(sheet, familyKey);
  if (row > 0) {
    sheet.getRange(row, 2).setValue(JSON.stringify(state));
    sheet.getRange(row, 3).setValue(updatedAt);
  } else {
    sheet.appendRow([familyKey, JSON.stringify(state), updatedAt]);
  }

  return json_({ ok: true, updatedAt: updatedAt });
}

function findRow_(sheet, familyKey) {
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim() === familyKey) return i + 1;
  }
  return -1;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
