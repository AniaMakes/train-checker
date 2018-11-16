require('dotenv').config();
const { promisify } = require('util');

const { NRE_TOKEN } = process.env;

const Rail = require('national-rail-darwin');
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
};

const journey = {
  departureCode: 'LST',
  destinationCode: 'WBC',
//   times: ['12', '42']
};

const travelOptions = [
    {
        departureCode: 'LST',
        destinationCode: 'WBC',
      },
{
    departureCode: 'KGX',
    destinationCode: 'WBC'
}
]

const upcomingServices = journeyObject => {
  const depCode = journeyObject.departureCode;

  const options = {};
  if (journeyObject.hasOwnProperty('destinationCode')) {
    options.destination = journeyObject.destinationCode;
  }

  getDepBoard(depCode, options)
    .then(function (data) {
      if (journeyObject.hasOwnProperty('times')) {
        return pickServices(journeyObject.times, data.trainServices);
      }
      return data;
    }
    )
    .then(data => console.log(data))
    .catch(err => console.log(err));
};

const potentialJourneys = arrayOfObjects => {
    arrayOfObjects.forEach(journey => upcomingServices(journey));
}

// upcomingServices(journey);

potentialJourneys(travelOptions);