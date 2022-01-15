const express = require('express');
const serverless = require('serverless-http');
const nodemailer = require('nodemailer');

const cors = require("cors");

const app = express();
const router = express.Router();

const YOUTUBE_ACCOUNT = process.env.YOUTUBE_ACCOUNT;
const YOUTUBE_APP_PW = process.env.YOUTUBE_APP_PW;

const allowedOrigins = [
    "https://simoncse.github.io",
];

// check origin
const corsOptions = {
    origin: (origin, callback) => {
        if (
            process.env.NETLIFY_DEV === "true" ||
            allowedOrigins.includes(origin)
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
};

router.use(cors(corsOptions));




router.get('/', (req, res) => {
    res.json({
        'message': 'Hello'
    })
})

router.post("/sendmail", async (req, res) => {


    const data = JSON.parse(req.body);
    const { name, email, subject, message } = data;
    console.log(name);

    // res.status(200)
    //     .send({
    //         message: 'success'
    //     })

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: YOUTUBE_ACCOUNT,
            pass: YOUTUBE_APP_PW
        }
    });

    const mailOptions = {
        from: email,
        to: 'simonkmc10@gmail.com',
        subject: `Message from ${email} on Personal Site: ${subject} `,
        html: `
            <h3>Email from ${name} ${email}<h3>
            ${message}`
    }


    try {
        let info = await transporter.sendMail(mailOptions)
        console.log(info)
        res
            .status(200)
            .send(JSON.stringify(info));
    }
    catch (error) {
        res.status(400).send({
            message: "Bad Request: " + error.message,
            success: false
        });
    }
})










app.use('/', router);

module.exports.handler = serverless(app);