const latestJobs = document.getElementById("latest-jobs");

fetchStockholmJobs();


function fetchStockholmJobs(){

fetch("http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=1&sida=1&antalrader=20")
  .then((response) => response.json())
  .then((jobs) => {
    displayJob(jobs)
   })

.catch((error) => {
  console.log(error)
});
}


function displayJob(jobs) {
  const job = jobs.matchningslista.matchningdata;
  const latestJobs = document.getElementById("latest-jobs");
let text = "";



for (let i = 0; i <  job.length; i++) {
text += `<table>
<tr>
<th>Titel</th>
<th><p>Kommun</th>
<th><p>Publicerad</th>    
</tr>
<tr>
<td>${job[i].annonsrubrik}</td>
<td>${job[i].kommunnamn}</td>
<td>${job[i].sista_ansokningsdag} </td> 
</tr>
</table> `;
}

document.getElementById("all-jobs").innerHTML = text;    
}

/* Save Working Ad */

let arrayOfSavedWorkingAd = []

function saveWorkingAd(workAdId){
    arrayOfSavedWorkingAd.push(workAdId);
    saveWorkingAdToLocalStorage();
}

function saveWorkingAdToLocalStorage(){
    let str = JSON.stringify(arrayOfSavedWorkingAd);
    localStorage.setItem("arrayOfSavedWorkingAd", str);
}

function getWorkingAdArrayFromLocalStorage(){
    let array = localStorage.getItem("arrayOfSavedWorkingAd");
    arrayOfSavedWorkingAd = JSON.parse(array);
    if (!arrayOfSavedWorkingAd){
        arrayOfSavedWorkingAd = [];
    }
}

getWorkingAdArrayFromLocalStorage();

console.log(arrayOfSavedWorkingAd);

let savedWorkAdOutput = document.getElementById('saved-work-ad-output');
let savedWorkAd = `
    <h3>Sparade annonser</h3>
    <button data-id="7663012" id="saveWorkAdButton">Save</button>
`;
savedWorkAdOutput.innerHTML = savedWorkAd;

let saveWorkAdButton = document.getElementById('saveWorkAdButton')

saveWorkAdButton.addEventListener('click', function(){
    var workingAdId = this.dataset.id;
    saveWorkingAd(workingAdId);
});

document.getElementById('clear').addEventListener('click', clearLocalStorage);
function clearLocalStorage() {
    localStorage.clear();
    location.reload();
    return false;
}
