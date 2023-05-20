

module.exports = {
    // Générer JWT token
    generateToken:(user) => {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const options = {
            expiresIn: process.env.JWT_EXPIRES_IN
        };

        return jwt.sign(payload, process.env.JWT_SECRET, options);
    },

    authenticateToken: (req, res, next) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Access denied. Token missing."  });
        }

        try {
            const decoded = jwt.verify(token, 'my-secret-key');
            req.user = decoded; // Ajoute les informations utilisateur au req object
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

}

