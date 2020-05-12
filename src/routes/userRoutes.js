const router = require("express")();
const userCreate = require('../middlewares/userCreateMiddleware');
const userControls = require('../controllers/userControls');

router.post('/create',[userCreate], (req, res) => {
    userControls.createUser(req.user)
        .then(resp => res.status(200).send(resp))
        .catch(err => res.status(400).send(err))
})

module.exports = router;
