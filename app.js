import express from 'express';
import env  from 'dotenv';
import AWS  from 'aws-sdk';
import cors from 'cors';
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
      SES.sendEmail(params).promise().then(data=>{
       console.log("Email sent successfully",data);
      })
      .catch(err=>{
        console.log(err)
      })
    
        } catch(error){
            console.log(error)
        }
    };
    res.send(sendEmail());   
    })
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})