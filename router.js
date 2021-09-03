const express = require('express')
const Contenedor = require('./Contenedor.js');

const cont = new Contenedor('./productos.txt');
const { Router } = express
const routerProductos = new Router()
routerProductos.use(express.json())
routerProductos.use(express.urlencoded({ extended: true }))
const mensajeDeError = 'Error Total'

const productos = []
//const copyProductos = []


routerProductos.get('/', (req, res, next) => {
    try {
        let result = JSON.parse(cont.getAll())
        for (x of result) {
            productos.push({title: x.title,
                price: x.price,
                thumbnail:x.thumbnail})
        }
        res.json(productos)
    }catch (error) {
        next(error)
    }
})

routerProductos.get('/:id', (req, res, next) => {
    try {
        let result = cont.getById(req.params.id)
        if (result != null){
            const objRes = {
                title: result.title,
                price: result.price,
                thumbnail: result.thumbnail
            };
            res.json(objRes);
        }else
            res.json('producto no encontrado')
    }catch (error) {
        next(error)
    }
})

routerProductos.post('/', (req, res, next) => {
    try {
        if (req.body.title != undefined 
            && req.body.price != undefined 
            && req.body.thumbnail != undefined){
        cont.save(req.body)
        const id = JSON.parse(cont.getAll()).length
        res.json(cont.getById(id))
        }else{
            res.json('Error: Falta parametro')  
        }
    } catch (error) {
        next(error)
    }
})

routerProductos.put('/:id', (req, res, next) => {
    try {
        let result = cont.getById(req.params.id)
        if (result != null){
            const copyProductos = JSON.parse(cont.getAll())
            cont.deleteAll()
            for (x of copyProductos) {
                if (x.id == req.params.id){
                    x.title = req.body.title
                    x.price = req.body.price
                    x.thumbnail = req.body.thumbnail
                    cont.save(x)
                }else
                    cont.save(x)
            }
            res.json(`producto id:${req.params.id} modificado`)
        }else
            res.json('producto no encontrado')
    }catch (error) {
        next(error)
    }
})


routerProductos.use((err, req, res, next) => {
    if (err.message == mensajeDeError) {
        res.status(500).json({ error: 'error de productos' })
    } else {
        next(err)
    }
})

routerProductos.delete('/:id', (req, res, next) => {
    try {
        let result = cont.getById(req.params.id)
        if (result != null){
            const copyProductos = JSON.parse(cont.getAll())
            cont.deleteAll()
            for (x of copyProductos) {
                if (x.id != req.params.id)
                cont.save(x)
            }
            res.json(`producto id:${req.params.id} borrado`)
        }else
            res.json('producto no encontrado')
    }catch (error) {
        next(error)
    }
})


module.exports = routerProductos
