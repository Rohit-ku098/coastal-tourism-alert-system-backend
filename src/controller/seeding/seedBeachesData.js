import { Beach } from "../../models/beach.model.js";
import beachesData from "../../constants/beaches.json" assert {type: "json"};

export const updateBeaches = async () => {
    try {
        beachesData.forEach(async (beach) => {
            await Beach.findOneAndUpdate(
                {
                    name: beach.name
                },
                beach,
                { upsert: true }
            )
        })
        console.log("beaches updated successfully");
    } catch (error) {
        console.log("Error::controller::updatebeaches", error);
    }
}