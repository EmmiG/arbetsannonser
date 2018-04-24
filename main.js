class FetchController {

    fetchStockholmJobs(rows = 10, countyId = 1) {
        console.log(rows);
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=${countyId}&sida=1&antalrader=${rows}`)
            .then((response) => response.json())
            .then((jobs) => {
                var displayDOM = new DOM();
                displayDOM.displayJob(jobs)
                displayDOM.sortAllJobs(jobs)

            })
            .catch((error) => {
                console.log(error)
            });
    }
    fetchJobDetails(id) {
        return fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/${id}`)
            .then(response => response.json())
            .then(jobs => {
                var displayDOM = new DOM();
                displayDOM.displayJobDetails(jobs);
            })
            .catch((error) => {
                console.log(error)
            });
    }
    fetchSearchedJobs(searchedInput) {
        console.log(searchedInput);
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrken/${searchedInput}`)
            .then(response => response.json())
            .then(jobs => {
                console.log(jobs);
                var displayDOM = new DOM();
                displayDOM.displaySearchedJobsByOccupationalTile(jobs)
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchJobsByOccupationalId(id) {
        return fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesid=${id}&sida=1&antalrader=2000`)
            .then(response => response.json())
            .then(jobs => {
                const newJobs = {
                    "matchningslista": {
                        "antal_platsannonser": jobs.matchningslista.antal_platsannonser_exakta,
                        "antal_platsannonser_exakta": jobs.matchningslista.antal_platsannonser_exakta,
                        "antal_platsannonser_narliggande": jobs.matchningslista.antal_platsannonser_narliggande,
                        "antal_platserTotal": jobs.matchningslista.antal_platserTotal,
                        "antal_sidor": jobs.matchningslista.anatl_sidor,
                        "matchningdata": []
                    }
                };
                for (let i = 0; i < jobs.matchningslista.antal_platsannonser_exakta; i++) {
                    newJobs.matchningslista.matchningdata.push(jobs.matchningslista.matchningdata[i]);
                }
                var displayDOM = new DOM();
                displayDOM.displayJob(newJobs);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    fetchCategories() {
        fetch("http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden")
            .then((response) => response.json())
            .then((categories) => {
                var displayDOM = new DOM();
                displayDOM.displayCategoriesDOM(categories);

            })
            .catch((error) => {
                console.log(error)
            });
    }
    fetchJobsByCategories(id) {
        fetch(`http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?yrkesomradeid=${id}&sida=1&antalrader=2000`)
            .then(response => response.json())
            .then(jobsByCategories => {
                console.log(jobsByCategories);
                var displayDOM = new DOM();
                displayDOM.displayJob(jobsByCategories);
            })
            .catch((error) => {
                console.log(error)
            });
    }
}

class DOM {
    sortAllJobs(jobs) {
        const jobAdverts = jobs.matchningslista.matchningdata;
        const latestTenJobs = document.getElementById("latest-jobs");

        jobAdverts.sort(function (a, b) {
            const x = a.publiceraddatum;
            const y = b.publiceraddatum;
            if (x < y) { return 1; }
            if (x > y) { return -1; }
            return 0;
        });

        displayTenLatestJobs(jobs);

        function displayTenLatestJobs(jobs) {

            let publishedJobList = `
                <table>
                    <tr>
                    <th>Titel</th>
                    <th>Yrkesbenämning</th>
                    <th>Arbetsplats</th>
                    <th>Anställningstyp</th>
                    <th>Kommun</th>
                    <th>Jobblänk</th> 
                    <th>Sista ansökningsdatum</th> 
                </tr>`;

            for (const jobAdvert of jobAdverts.slice(0, 10)) {

                publishedJobList += `     
                <tr>
                    <td class="moreInfo" data-id="${jobAdvert.annonsid}">
                        <a href="#/annons/${jobAdvert.annonsid}">
                            ${jobAdvert.annonsrubrik}
                        </a>
                    </td>
                    <td>${jobAdvert.yrkesbenamning}</td>
                    <td>${jobAdvert.arbetsplatsnamn}</td>
                    <td>${jobAdvert.anstallningstyp}</td>
                    <td>${jobAdvert.kommunnamn}</td>
                    <td><a href="${jobAdvert.annonsurl}">Gå till annonsen</a></td> 
                    <td>${jobAdvert.sista_ansokningsdag}</td> 
                </tr>`;
            }
            publishedJobList += "</table>";
            latestTenJobs.innerHTML = publishedJobList;

        }
    }
    displayJob(jobs) {
        const allJobs = document.getElementById("all-jobs");
        const totalNumberOfJobs = jobs.matchningslista.antal_platsannonser;
        const job = jobs.matchningslista.matchningdata;

        // select the number of jobs 

        let submitNumberButton = document.getElementById("submit-number");
        let numberOfJobs = document.getElementById("number-jobs");
        let countyJobs = document.getElementById("county-jobs");

        submitNumberButton.addEventListener("click", function () {
            let numberValue = numberOfJobs.value;
            let countyValue = countyJobs.value
            var fetchNumberOfJobs = new FetchController();
            fetchNumberOfJobs.fetchStockholmJobs(numberValue, countyValue);


            console.log(numberOfJobs.value)


        });


        let allJobList = `
        <h2>Antal lediga jobb: ${totalNumberOfJobs}</h2>
            <table>
            <tr>
                <th>Titel</th>
                <th>Yrkesbenämning</th>
                <th>Arbetsplats</th>
                <th>Anställningstyp</th>
                <th>Kommun</th>
                <th>Jobblänk</th> 
                <th>Sista ansökningsdatum</th> 
            </tr>`;
        console.log(job.length);
        for (let i = 0; i < job.length; i++) {

            allJobList += ` 
            <tr>
                <td class="moreInfo" data-id="${job[i].annonsid}">
                    <a href="#/annons/${job[i].annonsid}">
                        ${job[i].annonsrubrik}
                    </a>
                </td>
                <td>${job[i].yrkesbenamning} </td>
                <td>${job[i].arbetsplatsnamn} </td>
                <td>${job[i].anstallningstyp} </td>
                <td>${job[i].kommunnamn}</td>
                <td><a href="${job[i].annonsurl}">Gå till annonsen</a> </td> 
                <td>${job[i].sista_ansokningsdag} </td> 
            </tr>`;

        }

        allJobList += "</table>";
        allJobs.innerHTML = allJobList;



    }


    displayJobDetails(jobs) {
        let annonsDetaljer = "";
        const job = jobs.platsannons.annons;
        const conditions = jobs.platsannons.villkor;
        const apply = jobs.platsannons.ansokan;
        const jobplace = jobs.platsannons.arbetsplats;

        // cuts out the timestamp
        const sistaAnsokningsdag = apply.sista_ansokningsdag.substring(0, 10);

        // replaces /n/r with linebreak
        const adDescription = job.annonstext.replace(/(?:\r\n|\r|\n)/g, '<br />');

        annonsDetaljer += `
                <h2>${job.annonsrubrik}</h2>
                <h3>Om tjänsten</h3>
                ${job.yrkesbenamning && `<p>Sökes: ${job.yrkesbenamning}</p>`}
                ${job.anstallningstyp && `<p>Anställningstyp: ${job.anstallningstyp}</p>`}
                <h3>Om arbetsplatsen</h3>
                ${jobplace.arbetsplatsnamn && `<p>${jobplace.arbetsplatsnamn}</p>`}
                ${jobplace.besoksadress && `<p>${jobplace.besoksadress}</p>`}
                <h3>Villkor</h3>
                ${conditions.varaktighet && `<p>Varaktighet: ${conditions.varaktighet}</p>`}
                ${conditions.arbetstid && `<p>Arbetstid: ${conditions.arbetstid}</p>`}
                ${conditions.arbetstid && `<p>Löneform: ${conditions.loneform}</p>`}
                <h3>Ansökan</h3>
                ${apply.webbplats && `<a target="_blank" href="${apply.webbplats}">Ansök via företagets hemsida</a>`}
                ${sistaAnsokningsdag && `<p>Sista ansökning: ${sistaAnsokningsdag}</p>`}
                ${apply.ovrigt_om_ansokan && `<p>övrigt: ${apply.ovrigt_om_ansokan}</p>`}
                <h3>Om tjänsten</h3>
                ${job.annonstext && `<p>${adDescription}</p>`}
                <button data-id="${jobs.platsannons.annons.annonsid}" id="saveJobAdButton" name="${jobs.platsannons.annons.annonsrubrik}">Save</button>
            `;

        document.getElementById("annonsdetaljer").innerHTML = annonsDetaljer;

        const backToListButton = document.getElementById("back");
        backToListButton.addEventListener("click", function () {
            new DOM().showMainView();
            window.location.hash = "";
        });

        const adUrl = document.getElementById("ad-url");
        adUrl.value = window.location.href;

        const copyUrlButton = document.getElementById("copy-url");
        const copyConfirmText = document.getElementById("copy-confirm");

        copyUrlButton.addEventListener("click", function () {
            adUrl.select();
            document.execCommand("Copy");
            copyConfirmText.classList.remove("hidden");

            setTimeout(function () {
                copyConfirmText.classList.add("hidden");
            }, 1000);
        });

        let saveJobAdButton = document.getElementById("saveJobAdButton")
        saveJobAdButton.addEventListener("click", function () {
            var jobAd = {
                title: this.name,
                id: this.dataset.id
            };
            var saveJobUtility = new Utility();
            saveJobUtility.saveJobAd(jobAd);
        });
    }
    displaySavedJobAds() {
        let savedJobAdOutput = document.getElementById("saved-job-ad-output");
        let savedJobAd = "<h3>Sparade annonser</h3>";

        for (let i = 0; i < arrayOfSavedJobAd.length; i++) {
            savedJobAd += `
                <p data-id="${arrayOfSavedJobAd[i].id}" class="showSavedJobAd">
                    ${arrayOfSavedJobAd[i].title}
                </p>`;
        }
        savedJobAdOutput.innerHTML = savedJobAd;
        var jobAdTitleController = new Controller();
        jobAdTitleController.addEventlistenerToSavedJobAdTitle();
    }

    displaySearchedJobsByOccupationalTile(searchedJobsarray) {
        let outputSearchedJobs = document.getElementById("output-searched-jobs");
        var searchedJobs = searchedJobsarray.soklista.sokdata;
        console.log(searchedJobs);
        var searchedJobList = "";
        for (let i = 0; i < searchedJobs.length; i++) {
            if (searchedJobs[i].antal_platsannonser != 0) {
                searchedJobList += `
                <a href="#/sokresultat/${searchedJobs[i].namn}/${searchedJobs[i].id}" data-id="${searchedJobs[i].id}" class="searchOccupationalTile" >
                    ${searchedJobs[i].namn} (${searchedJobs[i].antal_platsannonser})
                </a>`;
            }
        }

        outputSearchedJobs.innerHTML = searchedJobList;
        const searchResultController = new Controller();
        searchResultController.addEventlisterToSearchJobResult();
    }
    displayCategoriesDOM(categories) {
        let categoryOutput = document.getElementById("categories-output");
        let category = categories.soklista.sokdata;
        let categoryList = "";
        for (let i = 0; i < category.length; i++) {
            categoryList += `
           <p data-id="${category[i].id}" class="categoryListObject">${category[i].namn}</p>`;
        }
        categoryOutput.innerHTML = categoryList;
        let addEventlistenerToCategories = new Controller();
        addEventlistenerToCategories.addEventlisterToCategories();
    }
    showMainView() {
        const mainView = document.getElementById("main-view");
        const singleView = document.getElementById("single-view");
        mainView.classList.remove("hidden");
        singleView.classList.add("hidden");
    }
    showSingleView() {
        const mainView = document.getElementById("main-view");
        const singleView = document.getElementById("single-view");
        singleView.classList.remove("hidden");
        mainView.classList.add("hidden");
    }

}

class Controller {
    checkInputUrl() {
        const copySearchContainer = document.getElementById("copy-search-results");

        if (window.location.hash.startsWith(`#/annons`)) {
            const annonsId = window.location.hash.split(`/`).pop();
            new FetchController().fetchJobDetails(annonsId);
            new DOM().showSingleView();
        }
        else if (window.location.hash.startsWith(`#/sokresultat`)) {
            copySearchContainer.classList.remove("hidden");
            const yrkesId = window.location.hash.split(`/`).pop();
            new FetchController().fetchJobsByOccupationalId(yrkesId);

            const input = document.getElementById("search-ad-url");
            input.value = window.location.href;

            const copyConfirmText = document.getElementById("search-copy-confirm");
            const copyButton = document.getElementById("search-copy-url");

            copyButton.addEventListener("click", function () {
                input.select();
                document.execCommand("Copy");
    
                copyConfirmText.classList.remove("hidden");
    
                setTimeout(function () {
                    copyConfirmText.classList.add("hidden");
                }, 1000);
            });
        }
        else {
            copySearchContainer.classList.add("hidden");
            window.location.hash = '';
            new DOM().showMainView();
        }
    }
    addEventlistenerToSavedJobAdTitle() {
        let showSavedJobAds = document.getElementsByClassName("showSavedJobAd");
        for (let showSavedJobAd of showSavedJobAds) {
            showSavedJobAd.addEventListener("click", function () {
                var fetchJobDetails = new FetchController();
                fetchJobDetails.fetchJobDetails(this.dataset.id);
                new DOM().showSingleView();
            });
        }
    }
    addEventListenerClearSavedJob() {
        document.getElementById("clear").addEventListener("click", function () {
            var clearLocalStorageUtility = new Utility();
            clearLocalStorageUtility.clearLocalStorage();
        });
    }
    addEventlistenerToSearchJob() {
        let searchJobButton = document.getElementById("searchJobButton");
        searchJobButton.addEventListener("click", function () {
            let searchJobInput = document.getElementById("searchJobInput").value;
            console.log(searchJobInput);
            let searchedJobsFetchController = new FetchController();
            searchedJobsFetchController.fetchSearchedJobs(searchJobInput);
        });
    }

    addEventlisterToSearchJobResult() {
        let searchResultTitles = document.getElementsByClassName("searchOccupationalTile");
        console.log(searchResultTitles);
        for (let searchResultTitle of searchResultTitles) {

            searchResultTitle.addEventListener("click", function () {
                const id = this.dataset.id;
                const fetchSearch = new FetchController();
                fetchSearch.fetchJobsByOccupationalId(id)
            })
        }
    }
    addEventlisterToCategories() {
        const jobCategories = document.getElementsByClassName("categoryListObject");
        for (let jobCategory of jobCategories) {
            // console.log(jobCategories[i]);
            jobCategory.addEventListener("click", function () {
                const id = this.dataset.id;
                const fetchJobsByCategory = new FetchController();
                fetchJobsByCategory.fetchJobsByCategories(id)
            })
        }
    }
}

class Utility {
    saveJobAd(jobAd) {
        arrayOfSavedJobAd.push(jobAd);
        var displayJobAdsDOM = new DOM();
        displayJobAdsDOM.displaySavedJobAds()
        scroll(0, 0)
        this.saveJobAdToLocalStorage();
    }
    saveJobAdToLocalStorage() {
        let str = JSON.stringify(arrayOfSavedJobAd);
        localStorage.setItem("arrayOfSavedJobAd", str);
    }
    getJobAdArrayFromLocalStorage() {
        let array = localStorage.getItem("arrayOfSavedJobAd");
        arrayOfSavedJobAd = JSON.parse(array);
        if (!arrayOfSavedJobAd) {
            arrayOfSavedJobAd = [];
        }
    }
    clearLocalStorage() {
        localStorage.clear();
        location.reload();
    }
}

arrayOfSavedJobAd = [];

var fetchStockholmJobs = new FetchController();
fetchStockholmJobs.fetchStockholmJobs();

let fetchCategories = new FetchController();
fetchCategories.fetchCategories();

var getJobAdArrayFromLocalStorage = new Utility();
getJobAdArrayFromLocalStorage.getJobAdArrayFromLocalStorage();

var displaySavedJobAds = new DOM();
displaySavedJobAds.displaySavedJobAds();

var controller = new Controller();
controller.checkInputUrl();

var clearLocalStorageController = new Controller();
clearLocalStorageController.addEventListenerClearSavedJob();

var addEventlistenerToSearchJob = new Controller();
addEventlistenerToSearchJob.addEventlistenerToSearchJob();

window.addEventListener('hashchange', event => {
    controller.checkInputUrl();
});