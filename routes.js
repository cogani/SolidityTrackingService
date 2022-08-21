const routes = require('next-routes')();

routes
  .add('/campaigns/new', '/campaigns/new')
 
  .add('/campaigns/:address', '/campaigns/show')
  .add('/campaigns/:address/requests', '/campaigns/requests/index')
  .add('/campaigns/:address/requests/new', '/campaigns/requests/new')

  .add('/trackings/newTracking', '/trackings/newTracking')
  .add('/trackings/:address', '/trackings/showTracking')
  .add('/trackings/:address/requests', '/trackings/requests/index')
  .add('/trackings/:address/requests/newMilestone', '/trackings/requests/newMilestone');


module.exports = routes;
