// middleware/masterAdminAuth.js
export default function masterAdminAuth(req, res, next) {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user info" });
        }

        if (req.user.role !== "masterAdmin") {
            return res.status(403).json({ message: "Forbidden: Master Admin only" });
        }
        next();

    } catch (err) {
        console.error("Master Admin Auth Error:", err);
        return res.status(500).json({ message: "Server error in Master Admin Auth" });
    }
}