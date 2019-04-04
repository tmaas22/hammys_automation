
// Simply sets the value within the cell for the google form link to the link
// arguments: Sheet (configSheet), String (ssName name of analyzed spreadsheet)
// returns: sortedSS (Spreadsheet of the new spreadsheet created)
// csFormShareLinkCell is defined in "readConfig.gs"
function writeDocURLToConfiguration(configSheet, ssName){
  var d = new Date();
  var timestamp = d.getTime();
  var sortedSS = SpreadsheetApp.create("GENERATED-" +timestamp + " SORTED" + ssName);
  configSheet.getRange(csFormShareLinkCell).setValue(sortedSS.getUrl());
  return sortedSS;
}

function resetActivateRunCell(configSheet){
  configSheet.getRange(csActivateRunCell).setValue("");
}


  
function insertCategoriesInConfigTab(configSheet){
  const categoryWeight = "bold";
  const allSize = 10;
  const categoryAlignment = "right";
  
  
}