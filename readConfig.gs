var csActivateRunCell = "C6";
var csFormShareLinkCell = "C7";

// reads the 'Configuration' sheet and parses the values of the user defined options
// arguments : Sheet (the configuration sheet)
// returns:  {'run': Bool, 'document' (optional) : String}, 
function readConfigurationTab(configSheet){
  
  var returnEntries = {};
  if(configSheet.getRange(csActivateRunCell).getValue() != ""){
    returnEntries["run"] = true;
  } else {
    returnEntries["run"] = false;
  }
  
  var linkCell = configSheet.getRange(csFormShareLinkCell).getValue();
  if( linkCell != ""){
    returnEntries["document"] = linkCell;
  }
  return returnEntries;
}