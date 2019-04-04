
var csRange = "B2:B9";
var csRangePos = 2; // This is the column number starting at 1 (B = 2)

var csValues = [
  ["Configuration Tab"],    // B2
  ["This tab allows for the app script to take in user options"], 
  [""], 
  ["Option"], 
  ["Generate Document (put X in next column):"],
  ["Generated Form link:"], 
  [""], 
  ["Counts of Awards"]     // B9
];

var csWeights = [
  ["bold"],     // B2
  ["normal"], 
  ["normal"], 
  ["bold"], 
  ["bold"],
  ["bold"],
  ["normal"], 
  ["bold"]      // B9
];

var csStyles = [
  ["italic"],  // B2
  ["italic"], 
  ["normal"], 
  ["italic"], 
  ["normal"],
  ["normal"], 
  ["normal"], 
  ["italic"]    // B9
];

var csSizes = [
  [14], // B2
  [10],       
  [10], 
  [12],
  [10],
  [10], 
  [10], 
  [12]  // B9
];


var csCategoryRange = "B10:D10";
var csCategoryValues = [
  [
    "Category", // B10
    "Nominee Count", 
    "Number of Final Nominees:"   // D10
  ]
];
var csCategoryWeights = [
  [
    "bold",  // B10
    "bold", 
    "bold"   // D10
  ]
];
var csCategorySizes = [
  [
    10,  // B10
    10,
    10   // D10
  ]
];

// Generates the configuration Sheet with the proper values and headers
// arguments: Sheet (the sheet that will be used as Configuration)
// returns: null
function formatConfigurationTab(configSheet){
  
  var configRange = configSheet.getRange(csRange);
  configRange.setValues(csValues);
  configRange.setFontWeights(csWeights);
  configRange.setFontStyles(csStyles);
  configRange.setFontSizes(csSizes);
  
  configSheet.setColumnWidth(csRangePos, 300);
  
  var configCatRange = configSheet.getRange(csCategoryRange);
  configCatRange.setValues(csCategoryValues);
  configCatRange.setFontWeights(csCategoryWeights);
  configCatRange.setFontSizes(csCategorySizes);
  
  return;
}