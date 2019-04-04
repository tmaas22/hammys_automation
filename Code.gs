
var csValues = [["Configuration Tab"], ["This tab allows for the app script to take in user options"], 
                   [""], ["Option"], ["Generate Document (put X in next column):"],
                   ["Generated Form link:"], [""], ["Counts of Awards"]];
var csRange = "B2:B9";
var csRangePos = 2;
var csActivateRun = "C6";
var csFormShareLink = "C7";
var csUserRange = "C6:C7"; // Generate document and google docs options.

var csCategoryHeaderRange = "B10:D10";
var csCategoryHeaderValues = [["Category", "Nominee Count", "Number of Final Nominees:"]];

function generateConfigurationTab(configSheet){
  const csWeights = [["bold"], ["normal"], 
                      ["normal"], ["bold"], ["bold"],
                      ["bold"], ["normal"], ["bold"]];
  const csStyles = [["italic"], ["italic"], 
                     ["normal"], ["italic"], ["normal"],
                     ["normal"], ["normal"], ["italic"]];
  const csSizes = [[14], [10],
                    [10], [12], [10],
                    [10], [10], [12]];
  const csCatWeights = [["bold","bold"], ["bold"]];
  const csCatSizes = [[10,10,10]];
  
  var configRange = configSheet.getRange(csRange);
  configRange.setValues(csValues);
  configRange.setFontWeights(csWeights);
  configRange.setFontStyles(csStyles);
  configRange.setFontSizes(csSizes);
  
  configSheet.setColumnWidth(csRangePos, 300);
  
  var configCatRange = configSheet.getRange(csCategoryHeaderRange);
  configCatRange.setValues(csCategoryHeaderValues);
  configCatRange.setFontWeights(csCatWeights);
  configCatRange.setFontSizes(csCatSizes);
  
  return;
  
}
  
function insertCategoriesInConfigTab(configSheet){
  const categoryWeight = "bold";
  const allSize = 10;
  const categoryAlignment = "right";
  
  
}


function readConfigurationTab(configSheet){
  userConfigRange = configSheet.getRange(csUserRange);
  
  var returnEntries = {};
  if(userConfigRange.getValue() != ""){
    returnEntries["run"] = true;
  } else {
    returnEntries["run"] = false;
  }
  var docCell = userConfigRange.getNextDataCell(SpreadsheetApp.Direction.DOWN).getValue();
  if( docCell != ""){
    returnEntries["document"] = docCell;
  }
  return returnEntries;
}


function writeDocURLToConfiguration(configSheet, docURL){
  configSheet.getRange(csFormShareLink).setValue(docURL);
}


function generateNominationDocument() {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var allSheets = ss.getSheets();
  
  const performerNameCell = 'A';
  const namePos = 0;
  const roleCell = 'B';
  const rolePos = 1;
  const classificationCell = 'C';
  const classPos = 2;
  const sortColumn = 3;
    
  var checkForConfig = 0;
  var configSheet;
  var i = 0;
  for (; i < allSheets.length; i++){
    var sheetName = allSheets[i].getName();
    if(sheetName.indexOf("Configuration")>-1){
      checkForConfig++;
      configSheet = allSheets[i];
      break;
    }
  }
  var userConfig = [];
  switch(checkForConfig){
    case 0:
      console.log("Could not find Config Sheet with name 'Configuration', adding one now");
      configSheet = ss.insertSheet('Configuration', i);
      generateConfigurationTab(configSheet);
      break;
    case 1:
      userConfig = readConfigurationTab(configSheet);
      break;
    default:
      Logger.log("Too many configs");
      return;
  }
  
  if(!userConfig["run"]){
    return;
  }
  
  var sortedSS;
  if(!('document' in userConfig)){
    sortedSS = SpreadsheetApp.create("SORTED by Category " + ss.getName() + " (AUTO)");
    writeDocURLToConfiguration(configSheet, sortedSS.getUrl());
  } else {
    sortedSS = SpreadsheetApp.openByUrl(userConfig['document']);
  }
  
  var lastSheetName;
  for(var i = 0; i < allSheets.length; i++){
    sheetName = allSheets[i].getSheetName();
    if((sheetName.indexOf("(Ignore)")>-1) || (sheetName.indexOf("Configuration")>-1)){ 
       Logger.log("Skipping sheet '" + sheetName + "'. Found '(Ignore)' or 'Configuration' in sheet name.");
       continue;
    }
    
    allSheets[i].sort(sortColumn);
    var data = allSheets[i].getDataRange().getValues();
    
    var entries = " Play";
    
    if(sheetName.indexOf("(Musical)")>-1) { 
      Logger.log("I'm changing stuff");
      var regExp = new RegExp("(.*)\s*\\(Musical\\)", "g");
      entries = " Musical";
      sheetName = sheetName.replace(regExp, '$1');
      Logger.log(sheetName);
  
    }
   
    var currentClass = data[1][classPos];
    var currentClassValues = [[]];
    var currentEntrySheet = sortedSS.getSheetByName(currentClass + entries);
    if(currentEntrySheet == null){
      currentEntrySheet = sortedSS.insertSheet(currentClass + entries);
    }
    
    var counter = 0;
    for(var j = 1; j < data.length; j++){
      var nominee = data[j][namePos] + " (" + data[j][rolePos] + ") - " + sheetName;
      Logger.log(nominee + " classification: " + data[j][classPos]);
      if(data[j][classPos] != currentClass || j == data.length-1){
        Logger.log("---------- Attempting to write " + currentClass);
        Logger.log(currentClassValues);
        Logger.log(currentClassValues.length);
        if(j== data.length - 1){
          currentClassValues[counter++] = [nominee];
        }
        
        var writeRange = currentEntrySheet.getRange(currentEntrySheet.getLastRow()+1, 1, currentClassValues.length);
        writeRange.setValues(currentClassValues);
        currentClass = data[j][classPos];
        currentEntrySheet = sortedSS.getSheetByName(currentClass + entries);
        if(currentEntrySheet == null){
          currentEntrySheet = sortedSS.insertSheet(currentClass + entries);
        }
        currentClassValues = [[nominee]];
        counter = 1;
      } else {
        currentClassValues[counter++] = [nominee];
      }
    }
  }
  allSorted = sortedSS.getSheets();
  for(var i = 0; i < allSorted.length; i++){
    allSorted[i].sort(1);
  }
  configSheet.getRange(csActivateRun).setValue("");
  
}