module.exports = {
    // Générer JWT token
generateToken:(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
    
}

