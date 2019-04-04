var performerNameColumn = 1;
var performerNameIdx = 0;
var roleIdx = 1;
var categoryIdx = 2;


// This function goes through and stores all the entries into a single key-value dictionary
// The key is the category name and the value is an array of the formatted nominees.
// arguments: Sheet[] 
// returns: {String: [String[]]} ex: {"category": [[nominee1],[nominee2]]}
function readNomineesInSheetArray(arrayOfSheets){
  var allNomineesMap = {};
  var sheetName;
    
  for(var i = 0; i < arrayOfSheets.length; i++){
    sheetName = arrayOfSheets[i].getSheetName();
    if((sheetName.indexOf("(Ignore)")>-1) || (sheetName.indexOf("Configuration")>-1)){ 
      console.log("Skipping sheet '" + sheetName + "'. Found '(Ignore)' or 'Configuration' in sheet name.");
      continue;
    }
    
    arrayOfSheets[i].sort(performerNameColumn);
    var data = arrayOfSheets[i].getDataRange().getValues();
    
    var showType = " Play";
    
    if(sheetName.indexOf("(Musical)")>-1) { 
      // Only collect musical title not (Musical)
      var regExp = new RegExp("(.*)\s*\\(Musical\\)", "g");
      showType = " Musical";
      sheetName = sheetName.replace(regExp, '$1');
    }
    
    // Start at 1, don't read top row.
    for(var j = 1; j < data.length; j++){
      var nomineeCategory = data[j][categoryIdx] + showType;
      
      var nominee = data[j][performerNameIdx] + " (" + data[j][roleIdx] + ") - " + sheetName;
      console.log(nominee + " classification: " + data[j][categoryIdx]);
      
      if(!(nomineeCategory in allNomineesMap)){
        Logger.log("Creating new entry in map for category: " + nomineeCategory);
        allNomineesMap[nomineeCategory] = [[nominee]];
      } else {
        Logger.log("Adding entry '" + nominee + "' to entry for " + nomineeCategory);
        allNomineesMap[nomineeCategory].push([nominee]);
      }
    }
  }
  
  return allNomineesMap;
}