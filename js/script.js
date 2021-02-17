var jsonString = '';
var rebuiltIni = ''; // For re-exporting the INI file.
var jsonObj = {};
// The promises were copied from "https://codepen.io/Anveio/pen/XzYBzX"
const readUploadedFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};

const handleUpload = async (event) => {
  const file = event.target.files[0];
  ////const fileContentDiv = document.querySelector('div#fileContentDiv');
  //const fileContentDiv = document.querySelector('pre#file-content');

  try {
    const fileContents = await readUploadedFileAsText(file);
    // The iniParser only works correctly if you open a valid INI file...
    //fileContentDiv.innerHTML = JSON.stringify(iniParser(fileContents),null,2);
    jsonObj = iniParser(fileContents);
    blankTheFields(); // Clears fields which should always be blank.
    //const jsonString = JSON.stringify(jsonObj,null,2);
    /*jsonString = JSON.stringify(jsonObj,null,2);
    fileContentDiv.innerHTML = jsonString;*/
    displayJson(jsonObj,'pre#file-content');
    
    document.getElementById('saveName').value = file.name;
    
  } catch (e) {
    //fileContentDiv.innerHTML = e.message
    alert(e.message);
  }
}
// The below line MUST go after the rest of the promise stuff, or else it won't work.
document.querySelector('input#fileSelector').addEventListener('change', handleUpload); 

//########################################
function iniParser(myInput){
  myInput = myInput.replace(/\r+\n|\r+/gm,'\n'); // replace all newline chars the '\n' for consistency
  // below splits all lines into separate array elements, frames each with quotes, then replaces the "=" with a ":"
  var myStr = myInput.split(/\r?\n|\r/)
    .map(eachRow => '"' + eachRow.replace(/\=/g,'": "') + '"')
    .map(eachRow => eachRow.replace(/^\"\s*\"/g,'')) //any lines with just quotes get replaced with empty vals
    .filter(notEmpty => notEmpty).join(',\n') // empty lines get removed.
    .replace(/\]\"\,/g,']": {').replace(/\,\n\"\[/g,'},\n"[')
    .replace(/\[|\]/g,''); //removed the brackets to see if it fixes the JSON parser.

  try{return JSON.parse('{' + myStr + '}}');}
   catch{return '{' + myStr + '}}';}
}


function rowSplitter(indexContent,cellDelim){ //made this just for simple debugging for now.
  //indexContent = indexContent.split(cellDelim);
  var myRegex = new RegExp(/\[.*\]/g);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  myRegex.test(indexContent) ? (indexContent = '"' + indexContent + '"') 
      : (indexContent ='\{"' + indexContent.replace('=','":"') + '"\},');
  return indexContent;
};

//########################################
function displayJson (jData,fileContentDivStr) {
  try{const fileContentDiv = document.querySelector(fileContentDivStr);
      fileContentDiv.innerHTML = JSON.stringify(jData,null,2);}
  catch (error) {alert(error.message);}
}

function createTable(tableData) {
  var table = document.getElementById('file-content');
  var tableBody = document.createElement('tbody');

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
};

/* ##########################################################################
   Below only works if the id of the input box matches the target JSON ele name.
   If an element doesn't exist, it creates it.
   Currently only works on two-level JSON objects like the INI file result.
   ##########################################################################*/
document.getElementById('fieldsToChange').addEventListener('input', ()=>{
  var oldVal;
  var jsonAddress = event.target.id.split('.');
  //console.log(event.target.id);
  try{oldVal = jsonObj[jsonAddress[0]][jsonAddress[1]];} //if it exists, set to old value
  catch{jsonObj[jsonAddress[0]]={}; jsonObj[jsonAddress[0]][jsonAddress[1]]='';} // if it doesn't exist, create it with an empty value.
  
  jsonObj[jsonAddress[0]][jsonAddress[1]] = document.getElementById(event.target.id).value; // updates the value in the global JSON object.
  displayJson(jsonObj,'pre#file-content'); // updates the displayed JSON.
  // console.log('changed from ' + oldVal + ' to ' + jsonObj[jsonAddress[0]][jsonAddress[1]]);
  formatToIni(); // <---This function needs revamped.
});

function blankTheFields(){ // just clears fields which should always be blank.
  jsonObj.EmailConfig.To = '';
  jsonObj.EmailConfig.Cc = '';
  jsonObj.EmailConfig.Bcc = '';
  jsonObj.EmailConfig.WaTo1 = '';
  jsonObj.EmailConfig.WaTo2 = '';
  jsonObj.EmailConfig.WaTo3 = '';
}

// ####################################################
function formatToIni(){ // This works, but it's very purpose-built. Can be improved.
  //var location= document.getElementById('iniVs').innerHTML;
  var location = document.querySelector('#iniVs');
  rebuiltIni = '';
/*https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  The Object.keys() method returns an array of a given object's own enumerable 
  property names, iterated in the same order that a normal loop would.*/
  for (var iniSection of Object.keys(jsonObj)) { //https://www.codegrepper.com/code-examples/javascript/loop+through+json+object+javascript
    //console.log(key);
    rebuiltIni += '[' + iniSection + ']\n';
    for (var key in jsonObj[iniSection]){
      if (jsonObj[iniSection].hasOwnProperty(key)){
        rebuiltIni += (key + '=' + jsonObj[iniSection][key] + '\n');
      }
    }
  }
  location.innerHTML = '<pre>' + rebuiltIni + '</pre>';
};

/*###################################################################
  ##############  File-save listeners and functions  ################
  ###################################################################*/
// Listener on the Save and Download button + the function triggered by it.
document.querySelector("#saveMyFile").addEventListener("click", function ()
{
    //var textToSave = jsonObj; // just the global JSON object
    // https://developer.mozilla.org/en-US/docs/Web/API/Blob
    //var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsBlob = new Blob([JSON.stringify(jsonObj, null, 2)], {type : 'application/json'});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("saveName").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    //downloadLink.onclick = destroyClickedElement;
    /*  the .onclick follows this syntax: target.onclick = functionRef;
        Instead of actually calling out to a separate function for something 
        this simple, just use an arrow. */
    downloadLink.onclick = (myEvent) => document.body.removeChild(myEvent.target);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
});

/*###################################################################
  Needs to have the embedded function split out and called by the listener instead
  since it has recycled code from the "save as JSON" event listener.
  ###################################################################*/
document.querySelector("#saveToIni").addEventListener("click", function ()
{
    //var textToSave = jsonObj; // just the global JSON object
    // https://developer.mozilla.org/en-US/docs/Web/API/Blob
    var textToSaveAsBlob = new Blob([rebuiltIni], {type : 'text/plain'});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("saveName").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    //downloadLink.onclick = destroyClickedElement;
    /*  the .onclick follows this syntax: target.onclick = functionRef;
        Instead of actually calling out to a separate function for something 
        this simple, just use an arrow. */
    downloadLink.onclick = (myEvent) => document.body.removeChild(myEvent.target);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
});



/* ###################################################################
                        FORM FIELD VALIDATION
   ###################################################################*/
// 

// For some reason, I can't get a query selector to work here????
/*By using 'change' instead of 'input', the test isn't run until the user
  shifts focus out of the input box. */
document.getElementById('NetworkConfig.PLC_IP').addEventListener('input', ()=>{
  var myTarget = document.getElementById('NetworkConfig.PLC_IP'); 
  var valToCheck = myTarget.value;
  //const ipRegEx = /\d{3}\.\d{3}\.\d{1,3}\.\d{1,3}/g;
   const ipRegEx = /((\b[1-9][0-9]?\b|\b1[0-9]{1,2}\b|\b2[0-5]{2}\b|\b0\b)\.){3}(\b[1-9][0-9]?\b|\b1[0-9]{1,2}\b|\b2[0-5]{2}\b|\b0\b)/
  //console.log(ipRegEx.test(valToCheck));
  if(ipRegEx.test(valToCheck)){
    myTarget.removeAttribute('style');
  }
  else{
    //alert('Enter a valid IP address');
    myTarget.setAttribute('style','background-color:Tomato'); // https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
    myTarget.focus();
  }
});
// jsonObj[jsonAddress[0]][jsonAddress[1]] = document.getElementById(event.target.id).value;
