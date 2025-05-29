const express = require('express');
const gymRouter = express.Router();
const {
  createGym,
  updateGym,
  deleteGym,
  getGymById,
  getGyms,
  getGymsByUserId,
  searchGyms
} = require('../controllers/gymController/gymController');



gymRouter.post('/create', createGym);

gymRouter.put('/update/:id', updateGym);


gymRouter.delete('/delete/:id', deleteGym);


gymRouter.get('/:id', getGymById);


gymRouter.get('/', getGyms);


gymRouter.get('/user/gyms', getGymsByUserId);


gymRouter.get('/search', searchGyms);

module.exports = gymRouter;
