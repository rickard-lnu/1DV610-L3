import Model from './models/model.js';
import View from './views/view.js';
import Controller from './controllers/controller.js';

const appModel = new Model();
const appView = new View();
const appController = new Controller(appModel, appView);

// Export for testing or console access
window.app = { model: appModel, view: appView, controller: appController };
