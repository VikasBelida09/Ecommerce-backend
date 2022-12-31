const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const cryptoJs = require('crypto-js');
const User = require('../models/User');
const router = require('express').Router();

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = cryptoJs.AES.encrypt(password, process.env.PASS_SEC).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(201).json(updatedUser)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

//deleting the user
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted!");
    } catch (error) {
        return res.status(500).json(error);
    }
})

//get user by id
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        return res.status(500).json(error);
    }
})

//get all users
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().select('-password').sort({ _id: -1 }).limit(5) : await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
})

//get user stats
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router;