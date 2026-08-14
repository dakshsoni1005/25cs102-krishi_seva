const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  state: z.string().min(2, "State name is required"),
  district: z.string().min(2, "District is required"),
  taluka: z.string().min(2, "Taluka is required"),
  village: z.string().min(2, "Village is required"),
  
  // Optional Farming Details
  farmSize: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : parseFloat(val)),
    z.number().min(0, "Farm size cannot be negative").optional()
  ),
  mainCrop: z.string().optional(),
  irrigationType: z.string().optional()
});

const loginSchema = z.object({
  mobileNumber: z.string().optional(),
  email: z.string().optional(),
  identifier: z.string().optional(),
  password: z.string().min(1, "Password is required")
}).refine((data) => !!(data.identifier || data.email || data.mobileNumber), {
  message: "Mobile number or Email address is required",
  path: ["identifier"]
});

module.exports = {
  registerSchema,
  loginSchema
};
