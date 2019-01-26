

module.exports.routes = {


  '/': {
    view: 'pages/homepage'
  },
  'POST /api/login': 'UsersController.login',
  'POST /api/users': 'UsersController.register',
  'GET /api/users': 'UsersController.getUsers',
  'PUT /api/users': 'UsersController.profileUpdate',
  'DELETE /api/users': 'UsersController.deleteUsers',
 

  // ssh root@139.59.12.86


  // password: A3CEKC74L7KCRN7I
  
};
