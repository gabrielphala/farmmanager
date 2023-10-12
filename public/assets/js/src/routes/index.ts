import baseRoutes from "./base";
import user from "./user"

export default () : void => {
    baseRoutes();
    user();
}