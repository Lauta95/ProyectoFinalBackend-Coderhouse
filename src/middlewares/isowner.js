export const isOwner = async (req, res, next) => {
    try {
        const { user } = req.user;
        const { cid } = req.params;
        console.log('IS OWNER??: ', cid);
        console.log('IS OWNER cid??: ', user.cartId);
        if (user.cartId != cid) {
            return res.status(403).send({ message: 'not authorized' })
        }
        next();
    } catch (err) {
        next(err);
    }
};