import 'core-js/es6/promise';
import '../css/style.css';
import Model from './model';
import View from './view';
import Controller from './controller';


const model = Model();
const controller = Controller();
const view = View(controller);

controller.init(model, view);
