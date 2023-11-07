export const isAdmin = async (req, res, next) => {
    try {
        const { user } = req.user;
        console.log('IS ADMIN??: ', user);
        if (user.role != 'admin') {
            return res.status(403).send({ message: 'not authorized' })
        }
        next();
    } catch (err) {
        next(err);
    }
};

// crear como isadmin pero premium

export const isPremium = async (req, res, next) => {
    try {
        const { user } = req.user;
        console.log('IS PREMIUM?:', user);
        if(user.role != 'premium') {
            return res.status(403).send({message: 'not authorized'});
        }
        next();
    }catch(err) {
        next(err)
    }
}