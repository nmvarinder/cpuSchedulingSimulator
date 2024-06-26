export const calculatePP = (arrivalTimes, burstTimes, priorities) => {
  let ganttChart = [];
  let table = [];
  let currentTime = 0;
  let jobs = arrivalTimes.map((time, index) => ({
    arrivalTime: time,
    burstTime: burstTimes[index],
    remainingTime: burstTimes[index],
    priority: priorities[index],
    job: `Job ${index + 1}`,
  }));
  let lastJob = null;

  while (jobs.length > 0) {
    let availableJobs = jobs.filter((job) => job.arrivalTime <= currentTime);
    if (availableJobs.length === 0) {
      currentTime++;
      continue;
    }

    let nextJob = availableJobs.reduce((prev, curr) =>
      prev.priority < curr.priority ? prev : curr
    );

    if (lastJob && lastJob.job !== nextJob.job) {
      ganttChart.push({
        job: lastJob.job,
        start: lastJob.start,
        end: currentTime,
      });
      nextJob.start = currentTime;
    } else if (!nextJob.start) {
      nextJob.start = currentTime;
    }

    nextJob.remainingTime--;
    currentTime++;

    if (nextJob.remainingTime === 0) {
      let finishTime = currentTime;
      let turnaroundTime = finishTime - nextJob.arrivalTime;
      let waitingTime = turnaroundTime - nextJob.burstTime;

      table.push({
        job: nextJob.job,
        arrivalTime: nextJob.arrivalTime,
        burstTime: nextJob.burstTime,
        finishTime: finishTime,
        turnaroundTime: turnaroundTime,
        waitingTime: waitingTime,
      });

      ganttChart.push({
        job: nextJob.job,
        start: nextJob.start,
        end: currentTime,
      });
      jobs = jobs.filter((job) => job !== nextJob);
      lastJob = null;
    } else {
      lastJob = nextJob;
    }
  }

  return { ganttChart, table };
};
