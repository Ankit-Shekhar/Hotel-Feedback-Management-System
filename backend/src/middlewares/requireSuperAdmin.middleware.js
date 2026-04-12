import { ApiError } from "../utils/ApiErrors.js";

export const requireSuperAdmin = (req, _res, next) => {
    if (req.admin?.role !== "super-admin") {
        throw new ApiError(403, "Only super admin can perform this action");
    }

    next();
};
