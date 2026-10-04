import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { database } from './db/database.js';
import useRoutes from './routes/app.routes.js'
import dns from 'dns/promises'
import path from 'path';


dns.setServers(['1.1.1.1','1.0.0.1']);
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express()
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:'http://localhost:3000',credentials:true}))
app.use('/api/auth',useRoutes);


if (process.env.NODE_ENV === 'production') {
  const outDir = path.join(__dirname, 'frontend', 'out');

  app.use(express.static(outDir, { extensions: ['html'] }));

  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(outDir, 'index.html'));
  });
}
    

app.listen(PORT,()=>{
    database();
    console.log(`Server running in port ${PORT}`);
})
