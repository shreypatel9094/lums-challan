const express = require('express');  
const customerController = require('../controllers/customerController');  
const { authenticateToken } = require('../middleware/auth');  
  
const router = express.Router();  
  
router.get('/', authenticateToken, customerController.getAllCustomers);  
router.get('/:id', authenticateToken, customerController.getCustomerById);  
router.post('/', authenticateToken, customerController.createCustomer);  
router.put('/:id', authenticateToken, customerController.updateCustomer);  
router.delete('/:id', authenticateToken, customerController.deleteCustomer);  
  
module.exports = router; 
