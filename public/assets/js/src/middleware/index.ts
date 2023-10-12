import { Middleware, Router, Environment } from "oddlyjs"
import fetch from "../helpers/fetch";

export default () => {
    Middleware.repeat(async (next: Function) => {
        const res = await fetch('/user/get/details/by/session');

        Environment.put('userDetails', res.userDetails, true);

        next()
    })
}