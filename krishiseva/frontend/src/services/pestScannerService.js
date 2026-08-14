import api from "./api";

export const pestScannerService = {
  scanLeafImage: async (imageFile) => {
    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error("Please select a valid leaf image file for scanning.");
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await api.post("/pest-scanner/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data.data;
  }
};

export default pestScannerService;
