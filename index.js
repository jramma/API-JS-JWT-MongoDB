const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { expressjwt: expressJwt } = require('express-jwt');
const User = require('./user')

mongoose.connect('mongodb+srv://user:@cluster0.tix7cgn.mongodb.net/auth?retryWrites=true&w=majority')

const app = express()

app.use(express.json())

const validateJwt = expressJwt({ secret: 'mi-string-secreto', algorithms: ['HS256'] })
const singToken = _id => jwt.sign({ _id }, 'mi-string-secreto')

app.post('/register', async (req, res) => {
    const { body } = req
    console.log({ body })

    try {
        const isUser = await User.findOne({ email: body.email })
        if (isUser) {
            return res.status(404).send('usuario ya existe')
        }
        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(body.password, salt)
        const user = await User.create({ email: body.email, password: hashed, salt })
        const token = singToken(user._id)
        res.status(201).send({ token })

    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }

})

app.post('/login', async (req, res) => {
    const { body } = req
    try {
        const user = await User.findOne({ email: body.email })
        if (!user) {
            res.status(403).send('usuario y/o contraseña inválida')
        } else {
            const isMatch = await bcrypt.compare(body.password, user.password)
            if (isMatch) {
                const tokenSigned = singToken(user._id)
                res.status(200).send(tokenSigned)
            } else {
                res.status(403).send('usuario y/o contraseña inválida')
            }
        }
    } catch (err) {
        res.status(500).send(err.message)
    }

})

app.get('/profile', validateJwt, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(401).end()
        }
        req.user = user
        next()
    } catch (e) {
        next(e)
    }
}, (req, res)=>{
    res.send(req.user)
})

app.listen(3000, () => {
    console.log('listening in port 3000')
})

