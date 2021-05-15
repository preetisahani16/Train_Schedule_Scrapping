const pup = require("puppeteer");
const fs = require("fs");

let source = "Allahabad";
let destination = "New Delhi";

let finalData=[];

let browser;
let tab;

async function main(){
        browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
    });
    let pages=await browser.pages();
    tab = pages[0];

    await tab.goto("https://www.railyatri.in/");
    await tab.click(".RY_vertical.train_info_list.train-info.hide_action");
    await new Promise(function(resolve,reject){
        setTimeout(resolve,2000);
    })
    let lists = await tab.$$(".train_info_popup .popup_list li");
    await lists[3].click();

    await tab.waitForNavigation({waitUntil:"networkidle2"});
    await tab.type("input[name='boarding_from']",source);
    await new Promise(function(resolve,reject){
        setTimeout(resolve,1000);
    })
    await tab.keyboard.press("ArrowDown");
    await tab.keyboard.press("Enter");
    await tab.type("input[name='boarding_to']",destination);
    await new Promise(function(resolve,reject){
        setTimeout(resolve,1000);
    })
    await tab.keyboard.press("ArrowDown");
    await tab.keyboard.press("Enter");
    await tab.click(".btn.btn-primary.tbs_search_btn");
    await tab.waitForSelector(".namePart p",{visible:true});
    let trainNamesPart=await tab.$$(".namePart p");
    let trainNames=[];
    for(let i of trainNamesPart){
        let trainName=await tab.evaluate(function(ele){
            return ele.textContent;
        },i);
        trainNames.push(trainName);
    }
    
    let departureTimePart = await tab.$$(".Departure-time.Departure-time-text-1");
    let trainDepartureTimes=[];
    for(let i of departureTimePart){
        let trainDepartureTime=await tab.evaluate(function(ele){
            return ele.textContent;
        },i);
        trainDepartureTimes.push(trainDepartureTime);
    }

    let arrivalTimePart = await tab.$$(".Arrival-time.Arrival-time-text-1.text-right");
    let trainArrivalTimes=[];
    for(let i of arrivalTimePart){
        let trainArrivalTime=await tab.evaluate(function(ele){
            return ele.textContent;
        },i);
        trainArrivalTimes.push(trainArrivalTime);
    }

    for(let i=0;i<trainNames.length;i++){
        let data={};
        data["TrainName"] = trainNames[i];
        data["DepartureTime"] = trainDepartureTimes[i];
        data["ArrivalTime"] = trainArrivalTimes[i];
        finalData.push(data);
    }

    fs.writeFileSync("finalData.json", JSON.stringify(finalData));
    await new Promise(function(resolve,reject){
        setTimeout(resolve,4000);
    })
    await tab.goto("file:///C:/Users/sudee/OneDrive/Desktop/Pep%20Dev/Pep_Hack/index.html");
    await new Promise(function(resolve,reject){
        setTimeout(resolve,9000);
    })
    browser.close();
}

main();