import express from "express";
import  {dadosUsuarios, usuarioIdade33,usuarioDataCriacao,filtraUsuario}  from "./controller.js";

const route = express.Router();

route.get("/teste", dadosUsuarios);
route.get('/usuarioIdade33',usuarioIdade33);
route.get('/dataCriacao/:data',usuarioDataCriacao);
route.get('/usuarios',filtraUsuario)
export default route;
