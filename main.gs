
function generateNominationDocument(nomineeMap, sortedSS) {
  for(var category in nomineeMap){
    var nomineeCount = nomineeMap[category].length;
    var currentEntrySheet = sortedSS.getSheetByName(category);
    if(currentEntrySheet == null){
      currentEntrySheet = sortedSS.insertSheet(category);
    }
    var writeRange = currentEntrySheet.getRange(currentEntrySheet.getLastRow()+1, 1, nomineeCount);
    writeRange.setValues(nomineeMap[category]);
  }
  return; 
}


function main(){
    
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var allSheets = ss.getSheets();
  
  var checkForConfig = 0;
  var configSheet;
  var i = 0;
  for (; i < allSheets.length; i++){
    var sheetName = allSheets[i].getName();
    if(sheetName.indexOf("Configuration")>-1){
      checkForConfig++;
      if(configSheet == null){
        configSheet = allSheets[i];
      }
    }
  }
  
  var userConfig = [];
  switch(checkForConfig){
    case 0:
      console.log("Could not find Config Sheet with name 'Configuration', adding one now");
      configSheet = ss.insertSheet('Configuration', i);
      formatConfigurationTab(configSheet);
      break;
    case 1:
      userConfig = readConfigurationTab(configSheet);
      break;
    default:
      console.log("Too many config sheets found. Using the 1st one");
      return;
  }
  
  if(!userConfig["run"]){
    return;
  }
  
  var sortedSS;
  if(!('document' in userConfig)){
    sortedSS = writeDocURLToConfiguration(configSheet, ss.getName());
  } else {
    sortedSS = SpreadsheetApp.openByUrl(userConfig['document']);
  }
  
  var nomineeMap = readNomineesInSheetArray(allSheets);
  
  generateNominationDocument(nomineeMap, sortedSS);
  
  // Remove any value from the "active run" cell
  resetActivateRunCell(configSheet);
}