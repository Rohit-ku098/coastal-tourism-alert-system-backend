import axios from "axios";
import cron from "node-cron";
import { Alert } from '../models/alerts.model.js'
import { HWA_SSA_INCOIS_API, OCEAN_CURRENTS_INCOIS_API } from "../constants/constants.js";
import State from "../utils/state.js";


const LatestSSADateState = new State("");
const LatestHWADateState = new State("");
const LatestCurrentsDateState = new State("");


const getHwaSsaLatestData = async () => {
  let hwa, ssa, LatestSSADate, LatestHWADate;
  await axios
    .get(HWA_SSA_INCOIS_API)
    .then((response) => {
      LatestSSADate = response.data?.LatestSSADate;
      LatestHWADate = response.data?.LatestHWAData;
      hwa = JSON.parse(response.data?.HWAJson);
      ssa = JSON.parse(response.data?.SSAJson);
    })
    .catch((error) => {
      console.log("Error in getHwaSsaLatestData", error);
    });
  return { hwa, ssa, LatestSSADate, LatestHWADate };
};

const getCurrentsLatestData = async () => {
  let oceanCurrent, LatestCurrentsDate;
  await axios
    .get(OCEAN_CURRENTS_INCOIS_API)
    .then((response) => {
      LatestCurrentsDate = response.data?.LatestCurrentsDate;
      oceanCurrent = JSON.parse(response.data?.CurrentsJson);
    })
    .catch((error) => {
      console.log(error);
    });
  return { oceanCurrent, LatestCurrentsDate };
};


const getBeachesOceanState = async () => {
  const { hwa, ssa, LatestSSADate, LatestHWADate } = await getHwaSsaLatestData();
  const { oceanCurrent, LatestCurrentsDate } = await getCurrentsLatestData();
  
  if(LatestCurrentsDateState.get() !== LatestCurrentsDate) {
    if(!!oceanCurrent) {
      // Ocean current alert
      oceanCurrent.forEach(async (currentData) => {
        await Alert.findOneAndUpdate(
          {
            OBJECTID: currentData.OBJECTID,
          },
          {
            $set: {
              oceanCurrent: {
                message: currentData.Message,
                alert: currentData.Alert?.split(" ").pop(),
                color: currentData.Color.toUpperCase(),
                issueDate: new Date(currentData["Issue Date"]),
              },
            },
          },
          { upsert: true, runValidators: true }
        );
      });
    }
    console.log("Currents Data Updated");
    LatestCurrentsDateState.set(LatestCurrentsDate);
  }

  // Swell surge alert
  if(LatestSSADateState.get() !== LatestSSADate) {
    if(ssa) {
      ssa.forEach(async (ssaData) => {
        await Alert.findOneAndUpdate(
          {
            OBJECTID: ssaData.OBJECTID,
          },
          {
            $set: {
              ssa: {
                message: ssaData.Message,
                alert: ssaData.Alert?.split(" ").pop(),
                color: ssaData.Color.toUpperCase(),
                issueDate: new Date(ssaData["Issue Date"]),
              },
            },
          },
          { upsert: true, runValidators: true }
        );
      });
    }

    console.log("SSA Data Updated");
    LatestSSADateState.set(LatestSSADate);
  }
  if(LatestHWADateState.get() !== LatestHWADate) {
    if(hwa) {
      hwa.forEach(async (hwaData) => {
        await Alert.findOneAndUpdate(
          {
            OBJECTID: hwaData.OBJECTID,
          },
          {
            $set: {
              hwa: {
                message: hwaData?.Message,
                alert: hwaData?.Alert?.split(" ").pop(),
                color: hwaData.Color.toUpperCase(),
                issueDate: new Date(hwaData["Issue Date"]),
              },
            },
          },
          { upsert: true, runValidators: true }
        );
      });
    }
    console.log("HWA Data Updated");
    LatestHWADateState.set(LatestHWADate);
  }
};

// TODO: uncomment it
// cron.schedule("* * * * *", () => {
//   getBeachesOceanState();
// });

