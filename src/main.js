/** instantiate MVC components and expose globally for debugging */
import Model from './models/model.js';
import View from './views/view.js';
import Controller from './controllers/controller.js';

const appModel = new Model();
const appView = new View();
const appController = new Controller(appModel, appView);

// export for testing or console access
/** @type {{model: Model, view: View, controller: Controller}} */
window.app = { model: appModel, view: appView, controller: appController };
