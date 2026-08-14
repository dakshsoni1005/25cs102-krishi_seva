const CropCycle = require("../../database/models/CropCycle");
const CropTask = require("../../database/models/CropTask");
const { STAGE_DISPLAY_MAPPINGS, STAGE_MAPPINGS } = require("../../config/constants");

const getActiveCrops = async (farmerId) => {
  const cycles = await CropCycle.find({ farmerId, status: "active" }).lean();
  
  // Attach tasks to each cycle dynamically
  const enriched = await Promise.all(
    cycles.map(async (c) => {
      const tasks = await CropTask.find({ cropCycleId: c._id });
      // Map stages back to display format for frontend compatibility
      const displayStage = Object.keys(STAGE_MAPPINGS).find(
        (key) => STAGE_MAPPINGS[key] === c.currentGrowthStage
      ) || c.currentGrowthStage;

      // Format timeline strings
      const timeline = c.timeline.map((t) => ({
        stage: t.stage,
        status: t.status,
        date: t.date ? t.date.toISOString().split("T")[0] : null
      }));

      return {
        id: c._id.toString(),
        name: c.cropName,
        variety: c.variety,
        area: c.area,
        sowingDate: c.sowingDate.toISOString().split("T")[0],
        currentStage: displayStage,
        expectedHarvest: c.expectedHarvestDate.toISOString().split("T")[0],
        healthStatus: c.healthStatus,
        pestWarning: c.healthStatus === "Alert" || c.healthStatus === "Critical",
        timeline,
        tasks: tasks.map((t) => ({
          id: t._id.toString(),
          title: t.title,
          category: t.taskType,
          status: t.status,
          dueDate: t.dueDate.toISOString().split("T")[0],
          dateDone: t.completedDate ? t.completedDate.toISOString().split("T")[0] : undefined
        }))
      };
    })
  );

  return enriched;
};

const addNewCrop = async (farmerId, cropData) => {
  const { name, variety, area, sowingDate, expectedHarvest } = cropData;

  if (!name || !area || !sowingDate) {
    const err = new Error("Name, area, and sowing date are required.");
    err.statusCode = 400;
    throw err;
  }

  const sowing = new Date(sowingDate);
  const harvest = expectedHarvest
    ? new Date(expectedHarvest)
    : new Date(sowing.getTime() + 120 * 24 * 60 * 60 * 1000); // 120 days default

  // Create initial timeline
  const timeline = [
    { stage: "Land Preparation", status: "completed", date: new Date(sowing.getTime() - 10*24*60*60*1000) },
    { stage: "Sowing", status: "active", date: sowing },
    { stage: "Germination", status: "upcoming", date: null },
    { stage: "Vegetative Growth", status: "upcoming", date: null },
    { stage: "Flowering", status: "upcoming", date: null },
    { stage: "Fruit/Grain Development", status: "upcoming", date: null },
    { stage: "Harvest", status: "upcoming", date: null }
  ];

  const cycle = await CropCycle.create({
    farmerId,
    cropName: name,
    variety: variety || "Local Strain",
    area: parseFloat(area),
    sowingDate: sowing,
    expectedHarvestDate: harvest,
    currentGrowthStage: "sowing",
    healthStatus: "Good",
    status: "active",
    timeline
  });

  // Create initial task
  await CropTask.create({
    cropCycleId: cycle._id,
    farmerId,
    title: "Monitor seed germination",
    taskType: "Inspection",
    dueDate: new Date(),
    status: "today",
    priority: "medium"
  });

  // Fetch fully enriched response
  const list = await getActiveCrops(farmerId);
  return list.find((c) => c.id === cycle._id.toString());
};

const updateCropStage = async (farmerId, cropId, displayStage) => {
  const cycle = await CropCycle.findOne({ _id: cropId, farmerId });
  if (!cycle) {
    const err = new Error("Crop cycle not found.");
    err.statusCode = 404;
    throw err;
  }

  // Convert display string to db key
  const dbStage = STAGE_MAPPINGS[displayStage];
  if (!dbStage) {
    const err = new Error(`Invalid stage name: ${displayStage}`);
    err.statusCode = 400;
    throw err;
  }

  // Advance timeline states
  let passed = true;
  cycle.timeline = cycle.timeline.map((item) => {
    if (item.stage === displayStage) {
      passed = false;
      return { ...item, status: "active", date: new Date() };
    }
    return {
      ...item,
      status: passed ? "completed" : "upcoming",
      date: passed ? (item.date || new Date()) : null
    };
  });

  cycle.currentGrowthStage = dbStage;
  await cycle.save();

  const list = await getActiveCrops(farmerId);
  return list.find((c) => c.id === cropId);
};

const toggleTaskStatus = async (farmerId, cropId, taskId) => {
  const task = await CropTask.findOne({ _id: taskId, cropCycleId: cropId, farmerId });
  if (!task) {
    const err = new Error("Task not found.");
    err.statusCode = 404;
    throw err;
  }

  if (task.status === "completed") {
    task.status = "today";
    task.completedDate = null;
  } else {
    task.status = "completed";
    task.completedDate = new Date();
  }

  await task.save();

  const list = await getActiveCrops(farmerId);
  return list.find((c) => c.id === cropId);
};

const addTask = async (farmerId, cropId, taskData) => {
  const { title, category, dueDate } = taskData;
  if (!title) {
    const err = new Error("Task title is required.");
    err.statusCode = 400;
    throw err;
  }

  const cycle = await CropCycle.findOne({ _id: cropId, farmerId });
  if (!cycle) {
    const err = new Error("Crop cycle not found.");
    err.statusCode = 404;
    throw err;
  }

  await CropTask.create({
    cropCycleId: cropId,
    farmerId,
    title,
    taskType: category || "Other",
    dueDate: dueDate ? new Date(dueDate) : new Date(),
    status: "upcoming",
    priority: "medium"
  });

  const list = await getActiveCrops(farmerId);
  return list.find((c) => c.id === cropId);
};

module.exports = {
  getActiveCrops,
  addNewCrop,
  updateCropStage,
  toggleTaskStatus,
  addTask
};
