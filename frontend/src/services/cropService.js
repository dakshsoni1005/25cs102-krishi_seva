import api from "./api";

export const cropService = {
  getActiveCrops: async () => {
    const response = await api.get("/crops");
    return response.data.data.crops;
  },

  getCropDetails: async (cropId) => {
    const crops = await cropService.getActiveCrops();
    const crop = crops.find((c) => c.id === cropId);
    if (!crop) throw new Error("Crop not found");
    return crop;
  },

  updateCropStage: async (cropId, newStage) => {
    const response = await api.patch(`/crops/${cropId}/stage`, { currentStage: newStage });
    return response.data.data.crop;
  },

  toggleTaskStatus: async (cropId, taskId) => {
    const response = await api.patch(`/crops/${cropId}/tasks/${taskId}`);
    return response.data.data.crop;
  },

  addTask: async (cropId, title, category, dueDate) => {
    const response = await api.post(`/crops/${cropId}/tasks`, { title, category, dueDate });
    return response.data.data.crop;
  },

  addNewCrop: async (cropData) => {
    const response = await api.post("/crops", cropData);
    return response.data.data.crop;
  }
};

export default cropService;
