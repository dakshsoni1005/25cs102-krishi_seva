import api from "./api";

export const pestScannerService = {
  scanLeafImage: async (imageFile) => {
    if (!imageFile) {
      throw new Error("No image file provided for analysis.");
    }

    const formData = new FormData();
    // Wrap file into standard form boundary payload
    // If it's a mock file (has URL but no binary blob), we can pass the name properties.
    if (imageFile instanceof File) {
      formData.append("file", imageFile);
    } else {
      // Mock selector fallback: append name to trigger correct mock prediction on server
      const blob = new Blob(["mock"], { type: "image/jpeg" });
      const mockFile = new File([blob], imageFile.name || "mock_leaf.jpg", { type: "image/jpeg" });
      formData.append("file", mockFile);
    }

    const response = await api.post("/pest-scanner/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data.data;
  }
};

export default pestScannerService;
