import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Card,
  Badge,
  Button,
  Modal,
  Select,
  SearchInput,
  PageHeader,
  Toast,
  LoadingSkeleton
} from "../components/common";
import { Landmark, Info, FileCheck2, XCircle } from "lucide-react";
import { schemeService } from "../services/schemeService";

export const GovernmentSchemes = () => {
  const { farmer, t, addLocalNotification } = useApp();

  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState([]);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [benefitFilter, setBenefitFilter] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  
  // Eligibility modal state
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  
  const [toast, setToast] = useState(null);

  const benefitOptions = [
    { value: "", label: "All Benefit Types" },
    { value: "Direct Income Support", label: "Direct Income Support" },
    { value: "Crop Insurance", label: "Crop Insurance" },
    { value: "Subsidies & Equipment", label: "Subsidies & Equipment" },
    { value: "Irrigation Support", label: "Irrigation Support" }
  ];

  const cropOptions = [
    { value: "", label: "All Crops" },
    { value: "Cotton", label: "Cotton" },
    { value: "Groundnut", label: "Groundnut" },
    { value: "Wheat", label: "Wheat" },
    { value: "Castor", label: "Castor" }
  ];

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setLoading(true);
        const filters = {
          search: searchTerm,
          benefitType: benefitFilter,
          crop: cropFilter,
          state: farmer?.state // Pass registered state as base constraint
        };
        const data = await schemeService.getSchemes(filters);
        setSchemes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSchemes();
  }, [searchTerm, benefitFilter, cropFilter, farmer]);

  const handleCheckEligibility = async (scheme) => {
    setSelectedScheme(scheme);
    setIsCheckOpen(true);
    setChecking(true);
    setEligibilityResult(null);

    try {
      const res = await schemeService.checkEligibility(farmer, scheme.id);
      setEligibilityResult(res);
    } catch (err) {
      setToast({ type: "error", message: "Eligibility check failed." });
    } finally {
      setChecking(false);
    }
  };

  const handleApplyScheme = (schemeName) => {
    setIsCheckOpen(false);
    setToast({ type: "success", message: `Application submitted for: ${schemeName}` });
    
    // Update local schemes list application status if matched
    setSchemes((prev) =>
      prev.map((s) =>
        s.name === schemeName ? { ...s, applicationStatus: "Applied" } : s
      )
    );

    addLocalNotification(
      "Scheme Applied",
      `Successfully submitted mock application details for ${schemeName}.`,
      "Government",
      "medium"
    );
  };

  const statusColors = {
    Approved: "success",
    Pending: "warning",
    Eligible: "primary",
    Applied: "info"
  };

  return (
    <div className="space-y-6 select-none">
      
      <PageHeader
        title={t("governmentSchemes")}
        subtitle="Central schemes search portal. Discover financial subsidies, crop insurance schemes, and direct income assistances."
      />

      {/* 1. FILTER CONTROLS */}
      <Card className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-border-soft p-5">
        <SearchInput
          placeholder="Search schemes or departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm("")}
        />

        <Select
          id="benefitFilter"
          options={benefitOptions}
          value={benefitFilter}
          onChange={(e) => setBenefitFilter(e.target.value)}
        />

        <Select
          id="cropSchemeFilter"
          options={cropOptions}
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
        />
      </Card>

      {/* 2. SCHEMES GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : schemes.length === 0 ? (
        <div className="text-center py-10 bg-white border border-border-soft rounded-xl text-xs text-text-muted font-semibold">
          No government schemes match your registered state ({farmer?.state}) and crop filter rules.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {schemes.map((sch) => (
            <Card key={sch.id} className="flex flex-col gap-4 bg-white border border-border-soft p-5 justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary-800 uppercase tracking-widest">{sch.benefitType}</span>
                    <h4 className="font-extrabold text-base text-text-dark mt-0.5 leading-snug">{sch.name}</h4>
                  </div>
                  <Badge variant={statusColors[sch.applicationStatus] || "primary"}>
                    {sch.applicationStatus}
                  </Badge>
                </div>
                
                <p className="text-xs text-text-muted font-semibold leading-relaxed border-t border-border-soft/60 pt-3">
                  Department: <span className="text-text-dark font-bold">{sch.department}</span>
                </p>

                <div className="bg-surface-soft/40 border border-border-soft/40 p-3 rounded-lg flex flex-col gap-1.5 text-xs">
                  <span className="font-bold text-[10px] uppercase">Benefits & Incentives:</span>
                  <p className="text-text-muted font-medium leading-relaxed">{sch.benefits}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border-soft pt-4 mt-1 text-xs">
                <span className="text-text-muted font-semibold">Deadline: <span className="text-text-dark font-bold">{sch.deadline}</span></span>
                {sch.applicationStatus === "Eligible" ? (
                  <Button size="sm" onClick={() => handleCheckEligibility(sch)}>
                    Check Eligibility
                  </Button>
                ) : sch.applicationStatus === "Approved" ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    ✓ Benefit Active
                  </span>
                ) : sch.applicationStatus === "Pending" ? (
                  <span className="text-amber-600 font-bold">
                    ⏱ Under Verification
                  </span>
                ) : (
                  <span className="text-text-muted font-semibold bg-surface-soft px-2.5 py-1 rounded border border-border-soft/60">
                    Application Filed
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 3. ELIGIBILITY EVALUATOR MODAL */}
      <Modal
        isOpen={isCheckOpen}
        onClose={() => setIsCheckOpen(false)}
        title={selectedScheme ? `Eligibility Checker: ${selectedScheme.name}` : ""}
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsCheckOpen(false)}>
              Close
            </Button>
            {eligibilityResult?.eligible && (
              <Button variant="primary" size="sm" onClick={() => handleApplyScheme(selectedScheme?.name)}>
                Apply Now
              </Button>
            )}
          </>
        }
      >
        {checking ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center text-xs">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin" />
            <span className="font-bold text-text-dark">Running geographic compliance checkers...</span>
          </div>
        ) : eligibilityResult && (
          <div className="space-y-4 text-xs font-semibold">
            {/* Status indicator */}
            <div className={`p-4 rounded-xl flex gap-3 border ${
              eligibilityResult.eligible
                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                : "bg-rose-50 text-rose-900 border-rose-200"
            }`}>
              {eligibilityResult.eligible ? (
                <FileCheck2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 flex flex-col gap-1">
                <span className="font-extrabold text-sm leading-tight">
                  {eligibilityResult.eligible ? "You qualify for this scheme!" : "You are currently ineligible"}
                </span>
                <p className="opacity-90 leading-relaxed font-medium mt-1">{eligibilityResult.reason}</p>
              </div>
            </div>

            {/* Scheme limits summary */}
            {selectedScheme && (
              <div className="bg-surface-soft/40 border border-border-soft p-3 rounded-lg space-y-1.5 leading-relaxed">
                <div className="text-[10px] font-bold text-text-muted uppercase border-b border-border-soft pb-1">Scheme constraints vs your profile:</div>
                <div>State: Limit: <b>{selectedScheme.eligibility.state}</b> vs Your State: <b>{farmer?.state}</b></div>
                <div>Farm Size: Limit: <b>{selectedScheme.eligibility.maxLandSize}</b> vs Your Size: <b>{farmer?.farmSize} Acres</b></div>
                <div>Crop: Limit: <b>{selectedScheme.eligibility.crops}</b> vs Your Crop: <b>{farmer?.mainCrop}</b></div>
              </div>
            )}

            {/* Next steps guideline */}
            {eligibilityResult.eligible && (
              <div className="space-y-2 border-t border-border-soft pt-3">
                <h4 className="font-extrabold uppercase text-[10px] text-primary-900 flex items-center gap-1">
                  <Info className="w-4 h-4 text-primary-800" />
                  Documentation checklist required:
                </h4>
                <p className="text-text-muted leading-relaxed font-medium">
                  {eligibilityResult.nextSteps}
                </p>
              </div>
            )}
          </div>
        )}
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
export default GovernmentSchemes;
