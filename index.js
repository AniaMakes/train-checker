require('dotenv').config();
const { promisify } = require("util");

const { NRE_TOKEN } = process.env;

const Rail = require("national-rail-darwin");
const rail = new Rail(NRE_TOKEN);

const getDepBoard = promisify(rail.getDepartureBoard.bind(rail));

// const processResults = (err, result) => {
//     console.log(JSON.stringify(result));
// }

// rail.getDepartureBoard("KGX", { destination: "CBG"}, processResults);
// etd: "On time" / "Cancelled"
// delayReason

// from ("hh:mm") returns "mm"
const getMinutes = time => (/(\d\d)$/).exec(time)[0];


const pickServices = (arrayOfPastTheHour, departuresBoardData) => {
    const desiredServices = departuresBoardData.filter(
        service => arrayOfPastTheHour.includes(getMinutes(service.std))
    );
    return desiredServices;
    
}


const journey = {
    departureCode: "KGX",
    // destinationCode: "CBG",
    times: ["12", "42"]
}

const upcomingServices = journeyObject => {
    const depCode = journeyObject.departureCode;
    
    const options = {}
    if (journeyObject.hasOwnProperty("destinationCode")){
        options.destination = journeyObject.destinationCode;
    }

    console.log(options);
    getDepBoard(depCode, options)
    .then(data => pickServices(journeyObject.times, data.trainServices))
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

upcomingServices(journey);
