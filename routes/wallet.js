const express = require('express')
const router = express.Router();
const walletCtrl = require('../controllers/wallet');

router.post('/', walletCtrl.createWallet);
router.post('/:id', walletCtrl.AddCard);
router.get('/deposit/:id', walletCtrl.deposit);
router.get('/transfert/:id', walletCtrl.transfert);

module.exports = router;