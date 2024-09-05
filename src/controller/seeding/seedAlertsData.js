import axios from "axios";
import cron from "node-cron";
import { Alert } from '../../models/alerts.model.js';
import { HWA_SSA_INCOIS_API, OCEAN_CURRENTS_INCOIS_API } from "../../constants/constants.js";
import State from "../../utils/state.js";
import { Notification } from "../../models/notification/notification.model.js";
import { Beach } from "../../models/beach.model.js";
import { asyncHandler } from '../../utils/asyncHandler.js'
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


const getBeachesOceanState = asyncHandler(async () => {
  const { hwa, ssa, LatestSSADate, LatestHWADate } = await getHwaSsaLatestData();
  const { oceanCurrent, LatestCurrentsDate } = await getCurrentsLatestData();
  
  // Seeding OCEAN CURRENTS data and Notifications
  try {
    if(LatestCurrentsDateState.get() !== LatestCurrentsDate) {
      if(!!oceanCurrent) {
        // Ocean current alert
        await oceanCurrent.forEach(async (currentData) => {
          const alert = await Alert.findOneAndUpdate(
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

          if(alert && (alert.oceanCurrent.alert === "ALERT" || alert.oceanCurrent.alert === "WARNING")) {
            const beaches = await Beach.find({OBJECTID: alert.OBJECTID});
            beaches.forEach( (beach) => {
              Notification.create({
                title: `Ocean Currents ${alert.oceanCurrent.alert}`,
                body: `Ocean Currents ${alert.oceanCurrent.alert} for ${beach.name}, ${beach.state}`,
                notificationFor: beach._id
              })
            })
          }
        });
  
      }
      console.log("Currents Data Updated");
      LatestCurrentsDateState.set(LatestCurrentsDate);
    }
  } catch (error) {
      console.log("Error in seedin ocean current data", error);
  }

  // Seeding SSA data
  try {
    if(LatestSSADateState.get() !== LatestSSADate) {
      if(ssa) {
        await ssa.forEach(async (ssaData) => {
          const alert = await Alert.findOneAndUpdate(
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

          if(alert && (alert.ssa.alert === "ALERT" || alert.ssa.alert === "WARNING")) {
            const beaches = await Beach.find({OBJECTID: alert.OBJECTID});
            beaches.forEach( (beach) => {
              Notification.create({
                title: `Swell Surge ${alert.ssa.alert}`,
                body: `Swell Surge ${alert.ssa.alert} for ${beach.name}, ${beach.state}`,
                notificationFor: beach._id
              })
            })
          }
        });

      }
  
      console.log("SSA Data Updated");
      LatestSSADateState.set(LatestSSADate);
    }
  } catch (error) {
      console.log("Error in seedin SSA data", error);
  }

  // Seeding HWA data
  try {
    if(LatestHWADateState.get() !== LatestHWADate) {
      if(hwa) {
        await hwa.forEach(async (hwaData) => {
          const alert = await Alert.findOneAndUpdate(
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

          if(alert && (alert.hwa.alert === "ALERT" || alert.hwa.alert === "WARNING")) {
            const beaches = await Beach.find({OBJECTID: alert.OBJECTID});
            beaches.forEach( (beach) => {
              Notification.create({
                title: `HWA ${alert.hwa.alert}`,
                body: `HWA ${alert.hwa.alert} for ${beach.name}, ${beach.state}`,
                notificationFor: beach._id
              })
            })
          }
        });
      }
      console.log("HWA Data Updated");
      LatestHWADateState.set(LatestHWADate);
    }
  } catch (error) {
      console.log("Error in seedin HWA data", error);
  }
})

// TODO: uncomment it
cron.schedule("*/10 * * * * *", () => {
  getBeachesOceanState();
});
