export const isDepartmentAdmin = (req, res, next) => {
  if (req.user.role === "departmentAdmin") {
    return next();  
  } else {
    return res.status(403).json({ message: "Not authorized as Department Admin" });
  }
};