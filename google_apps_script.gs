function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sync') || SpreadsheetApp.getActiveSpreadsheet().insertSheet('sync');
  if (sheet.getLastRow() === 0) sheet.appendRow(['familyKey', 'stateJson', 'updatedAt']);

  const action = (e.parameter.action || '').trim();
  const familyKey = (e.parameter.familyKey || '').trim();
  const callback = (e.parameter.callback || '').trim();
  if (action !== 'load' || !familyKey) {
    return json_({ ok: false, message: 'Invalid request' });
  }

  const row = findRow_(sheet, familyKey);
  const stateJson = row > 0 ? String(sheet.getRange(row, 2).getValue() || '{}') : '{}';
  const payload = { ok: true, state: JSON.parse(stateJson) };
  if (callback) return jsonp_(callback, payload);
  return json_(payload);
}

function doPost(e) {
  const body = parseBody_(e);
  const action = (body.action || '').trim();
  const familyKey = (body.familyKey || '').trim();
  if (action === 'notifyReward') {
    const to = String(body.to || 'ylc1979@gmail.com').trim() || 'ylc1979@gmail.com';
    const drawer = String(body.drawer || '').trim();
    const achievedAt = String(body.achievedAt || '').trim();
    const isTest = !!body.isTest;
    if (!familyKey) {
      return json_({ ok: false, message: 'Invalid payload' });
    }
    sendRewardMail_(to, familyKey, drawer, achievedAt, isTest);
    return json_({ ok: true, sentAt: Date.now() });
  }
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

function sendRewardMail_(to, familyKey, drawer, achievedAt, isTest) {
  const who = drawer ? '翻卡人：' + drawer : '翻卡人：未指定';
  const when = achievedAt || new Date().toISOString();
  const subject = isTest ? '【測試】每日正向抽卡機｜40 張完成通知' : '每日正向抽卡機｜40 張完成通知';
  const body = [
    isTest ? '這是一封測試通知信。' : '40 張正向小卡已完成。',
    '',
    '家庭代碼：' + familyKey,
    who,
    '完成時間：' + when,
    '',
    '恭喜獲得兌換泡澡球資格。'
  ].join('\n');
  MailApp.sendEmail(to, subject, body);
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

function jsonp_(callback, obj) {
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(obj) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function parseBody_(e) {
  try {
    const text = (e.postData && e.postData.contents) || '';
    if (text) return JSON.parse(text);
  } catch (err) {
  }
  const p = e.parameter || {};
  if (p.payload) {
    try {
      return JSON.parse(p.payload);
    } catch (err) {
    }
  }
  return p;
}
