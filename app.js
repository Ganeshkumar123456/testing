import express from 'express';
import env  from 'dotenv';
import { details } from './students.js'
import AWS  from 'aws-sdk';
import { nanoid }  from 'nanoid';
import cors from 'cors';
// const sendEmail = require('./ses.js');
const app =express();
app.use(express.json());
const port = 3000;
app.use(cors());
env.config();

const awsConfig = {
    sccessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.AWS_REGION
}

const SES = new AWS.SES(awsConfig);

app.post("/postsendemail",(req,res)=>{
    console.log(req.body);
    const sendEmail = async()=>{
        const email = process.env.FROM_EMAIL
        const shortCode = nanoid(6).toUpperCase()
        try{
      const params = {
        Source:email,
        Destination:{
            ToAddresses:[req.body.to_email],
        },
        Message:{
            Subject:{
                Data:req.body._subject,
            },
            Body:{
                Html:{
                    Charset:"UTF-8",
                    Data:req.body._textarea,
                },
            },
        },
      };
      details.push(params);
      res.json(params);
 
      const emailSent = await SES.sendEmail(params).promise()
      emailSent.then(data=>{
       console.log("Email sent successfully",data);
      })
      .catch(err=>{
        console.log(err)
      })
    
        } catch(error){
            console.log(error)
        }
    };
    res.send("welcome to post AWS",sendEmail());   
    })
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})