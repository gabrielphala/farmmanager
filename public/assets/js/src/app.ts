import { Load } from "oddlyjs";
import { loadSignal, watch } from "oddlyjs/src/Signal";

import routes from "./routes";
import events from "./events";
import middleware from "./middleware";

routes()
events()
middleware()

Load()

// setTimeout(() => {
//     loadSignal('departmentManagers').value = [{
//         fullname: 'Gabriel Ponsi',
//         email: 'Gabrielphala@outlook.com',
//         role: 'far',
//         createdOn: new Date() 
//     }];
// }, 2000);