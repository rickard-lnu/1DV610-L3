import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

const appModel = new Model();
const appView = new View();
const appController = new Controller(appModel, appView);

// Export for testing or console access
window.app = { model: appModel, view: appView, controller: appController };
