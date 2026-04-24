import express from 'express'
import  Route  from './Rotas.js';


const app = express();
const PORT =3000;


app.use('/api', Route);

app.listen(PORT,() =>{
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
})