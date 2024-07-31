import cron from "node-cron";
import { RemoveUrl } from "./RemoveUrl.js";

// const timeSchedule = `0-5 0 * * * *`; // Runs for every hour
const timeSchedule = `*/30 * * * * *`;

const start = () => {
  cron.schedule(timeSchedule, RemoveUrl);
  console.log("Cron-Job Scheduled");
};

export default start;
