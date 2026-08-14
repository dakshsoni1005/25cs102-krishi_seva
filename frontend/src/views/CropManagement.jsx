import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Card,
  Badge,
  Button,
  Modal,
  Input,
  Select,
  PageHeader,
  Toast,
  LoadingSkeleton,
  EmptyState
} from "../components/common";
import { Plus, CheckCircle, Circle, Cpu, Sprout, Calendar, Info } from "lucide-react";
import { cropService } from "../services/cropService";
import { smartKrishiService } from "../services/smartKrishiService";
import { mockStageGlossary } from "../mock/crops";

export const CropManagement = () => {
  const { t, addLocalNotification } = useApp();

  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  
  // Pipeline advisory state for selected crop
  const [pipelineAdvisory, setPipelineAdvisory] = useState(null);
  const [pipelineLoading, setPipelineLoading] = useState(false);

  // Modals & Forms state
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [newCropName, setNewCropName] = useState("Wheat");
  const [newCropVariety, setNewCropVariety] = useState("");
  const [newCropArea, setNewCropArea] = useState("");
  const [newCropSowingDate, setNewCropSowingDate] = useState("");
  
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Irrigation");
  
  const [toast, setToast] = useState(null);

  const cropNameOptions = [
    { value: "Cotton", label: "Bt Cotton" },
    { value: "Groundnut", label: "GG-20 Groundnut" },
    { value: "Wheat", label: "GW-496 Wheat" },
    { value: "Castor", label: "Castor" },
    { value: "Bajra", label: "Bajra" },
    { value: "Paddy", label: "Paddy" }
  ];

  const categoryOptions = [
    { value: "Irrigation", label: "Irrigation" },
    { value: "Fertilizer", label: "Fertilizer" },
    { value: "Pest Control", label: "Pest Control" },
    { value: "Weeding", label: "Weeding" },
    { value: "Soil Health", label: "Soil Health" },
    { value: "Inspection", label: "Inspection" }
  ];

  // Fetch active crops list from backend
  useEffect(() => {
    const loadCropsData = async () => {
      try {
        setLoading(true);
        const data = await cropService.getActiveCrops();
        const cropsList = Array.isArray(data) ? data : [];
        setCrops(cropsList);
        if (cropsList.length > 0) {
          setSelectedCrop(cropsList[0]);
        }
      } catch (err) {
        console.error("Error loading crops:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCropsData();
  }, []);

  // Fetch Smart Krishi Pipeline Advisory whenever selected crop changes
  useEffect(() => {
    if (!selectedCrop || !selectedCrop.name) return;

    const loadPipelineAdvisory = async () => {
      try {
        setPipelineLoading(true);
        // Call pipeline services for the selected crop
        const [calendar, fertilizers] = await Promise.allSettled([
          smartKrishiService.getCropCalendar(selectedCrop.name),
          smartKrishiService.getFertilizers(selectedCrop.name)
        ]);

        setPipelineAdvisory({
          calendar: calendar.status === "fulfilled" ? calendar.value : null,
          fertilizers: fertilizers.status === "fulfilled" ? fertilizers.value : null
        });
      } catch (err) {
        console.error("Error loading crop pipeline advisory:", err);
      } finally {
        setPipelineLoading(false);
      }
    };

    loadPipelineAdvisory();
  }, [selectedCrop?.id, selectedCrop?.name]);

  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
  };

  const handleToggleTaskStatus = async (taskId, taskTitle) => {
    if (!selectedCrop) return;
    try {
      const updatedCrop = await cropService.toggleTaskStatus(selectedCrop.id, taskId);
      
      setCrops((prev) => prev.map((c) => (c.id === selectedCrop.id ? updatedCrop : c)));
      setSelectedCrop(updatedCrop);

      const task = (updatedCrop.tasks || []).find((t) => t.id === taskId);
      if (task && task.status === "completed") {
        setToast({ type: "success", message: `Task "${taskTitle}" completed!` });
        addLocalNotification(
          "Task Checked",
          `Marked "${taskTitle}" as completed on your crop block.`,
          "Crop",
          "medium"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedCrop) return;

    try {
      const updatedCrop = await cropService.addTask(
        selectedCrop.id,
        newTaskTitle,
        newTaskCategory,
        new Date().toISOString().split("T")[0]
      );
      
      setCrops((prev) => prev.map((c) => (c.id === selectedCrop.id ? updatedCrop : c)));
      setSelectedCrop(updatedCrop);
      setNewTaskTitle("");
      
      setToast({ type: "success", message: "Successfully inserted new scheduled crop task." });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCropSubmit = async (e) => {
    e.preventDefault();
    if (!newCropName || !newCropArea) {
      setToast({ type: "error", message: "Please fill in all crop details." });
      return;
    }

    try {
      const newCrop = await cropService.addNewCrop({
        name: newCropName,
        variety: newCropVariety || "Hybrid-1",
        area: newCropArea,
        sowingDate: newCropSowingDate || new Date().toISOString().split("T")[0]
      });

      const updatedCropsList = await cropService.getActiveCrops();
      setCrops(updatedCropsList);
      setSelectedCrop(newCrop);
      setIsAddCropOpen(false);
      
      // Form resets
      setNewCropVariety("");
      setNewCropArea("");
      setNewCropSowingDate("");

      setToast({ type: "success", message: `Successfully registered new ${newCropName} crop block.` });
      addLocalNotification(
        "Crop Registered",
        `Created new crop block of ${newCropName} (${newCropArea} acres).`,
        "Crop",
        "medium"
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdvanceStage = async (stageName) => {
    if (!selectedCrop) return;
    if (confirm(`Do you want to update crop stage to "${stageName}"?`)) {
      const updated = await cropService.updateCropStage(selectedCrop.id, stageName);
      setCrops((prev) => prev.map((c) => (c.id === selectedCrop.id ? updated : c)));
      setSelectedCrop(updated);
      setToast({ type: "success", message: `Crop block stage updated to ${stageName}!` });
      addLocalNotification(
        "Crop Stage Updated",
        `${selectedCrop.name} has entered the ${stageName} phase.`,
        "Crop",
        "medium"
      );
    }
  };

  return (
    <div className="space-y-6 select-none">
      
      <PageHeader
        title={t("cropManagement")}
        subtitle="Track active crop lifecycles, schedule fertilizer dressings, check vegetative timelines, and receive Smart Krishi pipeline advisories."
        action={
          <Button variant="primary" size="sm" onClick={() => setIsAddCropOpen(true)} icon={Plus}>
            Register New Crop
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton /><LoadingSkeleton /><LoadingSkeleton />
        </div>
      ) : crops.length === 0 ? (
        <EmptyState
          title="No Crop Blocks Registered"
          description="Register your first field block to start tracking growth timelines and Smart Krishi pipeline schedules."
          actionLabel="Register Crop"
          onAction={() => setIsAddCropOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* 1. LEFT SIDEBAR: ACTIVE CROP BLOCKS SELECTOR */}
          <div className="lg:col-span-1 space-y-4">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Active Crop Blocks
            </span>
            
            <div className="flex flex-col gap-3">
              {crops.map((c) => {
                const isSelected = selectedCrop?.id === c.id;
                return (
                  <Card
                    key={c.id || c._id}
                    onClick={() => handleSelectCrop(c)}
                    className={`p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary-800 bg-primary-50/20 shadow-xs"
                        : "border-border-soft hover:border-primary-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-text-dark">{c.name}</span>
                      <Badge variant={c.healthStatus === "Good" ? "success" : "warning"}>
                        {c.healthStatus || "Good"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-text-muted font-semibold mt-1 truncate">
                      {c.variety || "Hybrid"} • {c.area || 5} Acres
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 2. CENTER STAGES TIMELINE & PIPELINE ADVISORY (2/4 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {selectedCrop && (
              <>
                {/* Crop Block Details */}
                <Card className="bg-white border border-border-soft p-5">
                  <div className="flex justify-between items-start border-b border-border-soft pb-3 mb-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-text-dark">{selectedCrop.name} Block</h3>
                      <p className="text-xs text-text-muted font-semibold mt-0.5">
                        {selectedCrop.variety} • Sown: {selectedCrop.sowingDate || "2026-06-15"}
                      </p>
                    </div>
                    <Badge variant="primary">
                      Stage: {selectedCrop.currentStage || "Vegetative Growth"}
                    </Badge>
                  </div>

                  {/* Growth Stages Vertical Timeline */}
                  <div className="space-y-4 text-xs font-semibold relative pl-4 border-l-2 border-border-soft">
                    {(selectedCrop.timeline || []).map((item, idx) => {
                      const isActive = item.status === "active";
                      const isCompleted = item.status === "completed";
                      const stageDescription = mockStageGlossary[item.stage] || "Growth phase monitoring for optimal crop yield.";
                      
                      return (
                        <div key={idx} className="relative flex items-start gap-4 group">
                          {/* Bullet marker */}
                          <div className={`absolute -left-6.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isActive
                              ? "bg-white border-primary-800 ring-4 ring-primary-100 animate-pulse"
                              : isCompleted
                              ? "bg-primary-800 border-primary-800"
                              : "bg-white border-border-soft"
                          }`}>
                            {isCompleted && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>

                          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-1.5">
                            <div className="flex flex-col gap-0.5">
                              <span className={`font-bold text-sm ${isActive ? "text-primary-900" : isCompleted ? "text-text-dark" : "text-text-muted"}`}>
                                {item.stage}
                              </span>
                              <span className="text-[10px] text-text-muted font-medium max-w-sm leading-relaxed">
                                {stageDescription}
                              </span>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {item.date && (
                                <span className="text-[10px] text-text-muted bg-surface-soft/60 px-2 py-0.5 rounded border border-border-soft/40">
                                  {item.date}
                                </span>
                              )}
                              {!isCompleted && !isActive && (
                                <button
                                  onClick={() => handleAdvanceStage(item.stage)}
                                  className="text-[10px] font-extrabold text-primary-800 hover:underline cursor-pointer"
                                >
                                  Activate
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* 3. SMART KRISHI PIPELINE ADVISORY CARD */}
                <Card className="bg-[#F9FAF8] border border-[#DCE4D7] p-5">
                  <div className="flex items-center justify-between border-b border-[#DCE4D7] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary-800 shrink-0" />
                      <h4 className="font-extrabold text-base text-text-dark">
                        Smart Krishi Pipeline Advisory — {selectedCrop.name}
                      </h4>
                    </div>
                    <span className="text-[10px] bg-primary-800 text-white font-bold px-2.5 py-0.5 rounded-full">
                      Pipeline Live
                    </span>
                  </div>

                  {pipelineLoading ? (
                    <div className="space-y-2 py-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs font-medium text-text-dark">
                      <div className="p-3 bg-white rounded-lg border border-border-soft flex flex-col gap-1">
                        <span className="font-extrabold text-primary-900 text-xs flex items-center gap-1.5">
                          <Sprout className="w-4 h-4 text-primary-800 shrink-0" />
                          Recommended Nutrient Dosages ({selectedCrop.name})
                        </span>
                        <p className="text-[#555A50] leading-relaxed text-[11px] m-0">
                          {pipelineAdvisory?.fertilizers?.recommendation || 
                           `For ${selectedCrop.name} during ${selectedCrop.currentStage || "Vegetative Growth"}: Apply Urea @ 50 kg/acre and DAP @ 35 kg/acre on moist soil. Incorporate organic compost for root anchorage.`}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-border-soft flex flex-col gap-1">
                        <span className="font-extrabold text-primary-900 text-xs flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-primary-800 shrink-0" />
                          Pipeline Crop Growth Calendar Schedule
                        </span>
                        <p className="text-[#555A50] leading-relaxed text-[11px] m-0">
                          {pipelineAdvisory?.calendar?.schedule || 
                           `Ideal growth timeline for ${selectedCrop.name}: Vegetative phase (Days 30-60), Flowering phase (Days 60-90), Grain maturation (Days 90-120). Keep drip irrigation active.`}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </>
            )}

          </div>

          {/* 4. RIGHT SIDE: TASK MANAGER (1/4 width) */}
          <div className="lg:col-span-1 space-y-6">
            
            {selectedCrop && (
              <Card className="flex flex-col gap-4 bg-white border border-border-soft p-4">
                <h4 className="font-extrabold text-base text-text-dark border-b border-border-soft pb-3 select-none">
                  Advisory Tasks Scheduling
                </h4>

                {/* Task List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {(selectedCrop.tasks || []).map((task) => {
                    const isDone = task.status === "completed";
                    return (
                      <div
                        key={task.id || task._id}
                        onClick={() => handleToggleTaskStatus(task.id || task._id, task.title)}
                        className="flex items-start gap-2.5 p-2 bg-surface-soft/40 hover:bg-surface-soft border border-border-soft/40 rounded-lg cursor-pointer transition-colors text-xs font-semibold"
                      >
                        <button type="button" className="text-text-muted hover:text-primary-800 cursor-pointer shrink-0 mt-0.5">
                          {isDone ? (
                            <CheckCircle className="w-4.5 h-4.5 text-primary-800 shrink-0" />
                          ) : (
                            <Circle className="w-4.5 h-4.5 shrink-0" />
                          )}
                        </button>
                        
                        <div className="flex-1 flex flex-col min-w-0">
                          <span className={`text-text-dark truncate leading-tight ${isDone ? "line-through text-text-muted" : ""}`}>
                            {task.title}
                          </span>
                          <span className="text-[9px] text-text-muted font-medium mt-0.5">
                            Category: {task.category}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Add Task Form */}
                <form onSubmit={handleAddTaskSubmit} className="border-t border-border-soft pt-4 space-y-3">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Quick Add Task
                  </span>
                  
                  <Input
                    id="quickTaskTitle"
                    placeholder="e.g. Inspect Block B"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="text-xs"
                  />

                  <div className="flex gap-2">
                    <Select
                      id="quickTaskCat"
                      options={categoryOptions}
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="text-xs flex-1"
                    />
                    <Button type="submit" size="sm" className="shrink-0 px-3">
                      Add
                    </Button>
                  </div>
                </form>
              </Card>
            )}

          </div>

        </div>
      )}

      {/* REGISTER NEW CROP MODAL */}
      <Modal
        isOpen={isAddCropOpen}
        onClose={() => setIsAddCropOpen(false)}
        title="Register New Crop Block"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddCropOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateCropSubmit}>
              Register Block
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleCreateCropSubmit}>
          <Select
            label="Crop Name"
            id="modalCropName"
            options={cropNameOptions}
            value={newCropName}
            onChange={(e) => setNewCropName(e.target.value)}
          />
          
          <Input
            label="Variety / Hybrid Strain"
            id="modalCropVariety"
            placeholder="e.g. BG-II or Local Strain"
            value={newCropVariety}
            onChange={(e) => setNewCropVariety(e.target.value)}
          />

          <Input
            label="Cultivation Area (Acres)"
            id="modalCropArea"
            type="number"
            step="0.1"
            placeholder="e.g. 5.5"
            required
            value={newCropArea}
            onChange={(e) => setNewCropArea(e.target.value)}
          />

          <Input
            label="Sowing Date"
            id="modalSowingDate"
            type="date"
            required
            value={newCropSowingDate}
            onChange={(e) => setNewCropSowingDate(e.target.value)}
          />
        </form>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
};
export default CropManagement;
