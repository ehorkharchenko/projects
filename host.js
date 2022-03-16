const crypto = require("crypto")

const fs = require("fs")

const koa = require("koa")
const www = new koa()

const koa__router = require("koa-router")
const router = new koa__router()

const http = require("http").createServer( www.callback() )

const socket = require( "socket.io" )( http, {})

const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/vail-db")
  .then( () => console.log(" mongodb has started ") )
  .catch( err => console.log( err ) )

const config = require( "./config.json" )

const IP = config.IP || "127.0.0.1", PORT = config.PORT || 4040

require("./schemas.js")
const Product = mongoose.model( "catalog" ),
      Order = mongoose.model( "orders" ),
      User = mongoose.model( "users" )

router.get( "/favicon.ico", async ctx => ctx.body = fs.readFileSync( "./favicon.ico" ) )

router.get( "/", async ctx => {

    ctx.set( "Content-Type", "text/html" )
    ctx.body = fs.readFileSync( "./document.html" )
})

router.get( "/administrator", async ctx => {

    ctx.set( "Content-Type", "text/html" )
    ctx.body = fs.readFileSync( "./administratordashboard.html" )
})

router.get( "/img/:img", async ctx => {

    ctx.set( "Content-Type", "image/svg+xml" )
    ctx.body = fs.readFileSync(`./src/img/${ ctx.params.img }`)
})

router.get( "/src/script/:file", async ctx => {

  ctx.set("Content-Type", "text/javascript")
  ctx.body = fs.readFileSync( `./src/script/${ ctx.params.file }` )
})

const catalog = [
  {
    product__type: "headphones",
    product__name: "AirPods 2",
    product__cost: "3 099",
    product__img: "/img/airpods-2.svg"
  },
  {
    product__type: "headphones",
    product__name: "AirPods Pro",
    product__cost: "6 475",
    product__img: "/img/airpods-pro.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone SE 2020 64GB",
    product__cost: "12 500",
    product__img: "/img/iphone-se-2020.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone SE 2020 128GB",
    product__cost: "13 800",
    product__img: "/img/iphone-se-2020.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 7+ 32GB",
    product__cost: "10 200",
    product__img: "/img/iphone-7+.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 7+ 128GB",
    product__cost: "11 800",
    product__img: "/img/iphone-7+.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 8 64GB",
    product__cost: "8 500",
    product__img: "/img/iphone-8.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 8 256GB",
    product__cost: "9 700",
    product__img: "/img/iphone-8.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 8+ 64GB",
    product__cost: "8 500",
    product__img: "/img/iphone-8+.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 8+ 256GB",
    product__cost: "14 100",
    product__img: "/img/iphone-8+.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone X 64GB",
    product__cost: "13 600",
    product__img: "/img/iphone-x.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone X 256GB",
    product__cost: "14 800",
    product__img: "/img/iphone-x.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone XR 64GB",
    product__cost: "13 800",
    product__img: "/img/iphone-xr.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone XR 128GB",
    product__cost: "15 400",
    product__img: "/img/iphone-xr.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone XS 64GB",
    product__cost: "15 300",
    product__img: "/img/iphone-xs.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone XS Max 64GB",
    product__cost: "17 200",
    product__img: "/img/iphone-xs-max.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 11 64GB",
    product__cost: "18 500",
    product__img: "/img/iphone-11.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 11 Pro 64GB",
    product__cost: "21 400",
    product__img: "/img/iphone-11-pro.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 11 Pro Max 256GB",
    product__cost: "25 300",
    product__img: "/img/iphone-11-pro-max.svg"
  },
  {
    product__type: "phone",
    product__name: "iPhone 13 Pro 256GB",
    product__cost: "42 800",
    product__img: "/img/iphone-13-pro.svg"
  }
]

function one () {

  console.log( catalog )

  catalog.map( product => {

    new Product({
      product__type: product.product__type,
      product__name: product.product__name,
      product__cost: product.product__cost,
      product__img: product.product__img
    })
      .save()
        .then( obj => { console.log( obj ) })
        .catch( err =>  console.log( err ) )
  })

}

//one()

const authorize__tokens = []

// API
socket.on( "connection", stream => {

  Product.find({})
    .then( catalog => socket.emit( "get catalog", catalog ) )
    .catch( err => console.log( err ) )

  stream.on( "authorize", ( data, callback ) => {

      const create__authorize__token = function () {

        let token = ""

        for ( let i = 0; i < 50; i++ )
          token += Math.floor( Math.random() * 9 )

        return token
      }

      User.find({ user: data.user.name })
        .then( users => {

          const user = users[0],
                key = crypto
                        .createHash("sha512")
                        .update( data.user.password )
                        .digest( "hex" ),
                token = create__authorize__token()

          if ( user.key === key )
            if ( users[0].password === data.password ) {

              authorize__tokens.push({ user: data.user.name, token: token })

              callback({
                authorize__status: true,
                authorize__token: token
              })
            }

        })
        .catch( err => console.log( err ) )
  })

  stream.on( "get orders", ( data, callback ) => {

    console.log( data )
      Order.find({ status: data.orders__status })
        .then( orders => {
          console.log( orders )
          callback({ status: "ok", orders: orders })
        })
        .catch( err => {
          callback({ status: "empty" })
        })
  })

  stream.on( "change order status", ( data, callback ) => {

    Order.find({ _id: data.order_id })
      .then( orders => {

        orders[0].status = data.status

        orders[0]
          .save()
            .then( order => console.log( order ) )
            .catch( err => console.log( err ) )

      })
  })

  stream.on( "register order", ( data, callback ) => {

    new Order({
      status: "noreg",
      order__date: data.order__date,
      order: data.order,
      full__name: data.full__name,
      phone__number: data.phone__number,
      delivery__method: data.delivery__method,
      city: data.city,
      branch__number__or__address: data.branch__number__or__address,
      comment: data.comment
    })
      .save()
        .then( order => {

          callback({ status: "ok", order_number: order._id })
        })
        .catch( err => console.log( err ) )
  })

  stream.on( "reg/unreg user", ( data, callback ) => {

      // console.log( data )

      if ( data.method === "reg" ){

        const password = crypto
          .createHash("sha512")
          .update( data.user.password )
          .digest("hex")

        new User({
          user: data.user.name,
          key: password,
          access__level: "administrator"
        })
          .save()
            .then( user => console.log( user ) )
            .catch( err => console.log( err ) )

      } else if ( data.method === "unreg" ) {

        User.find({ user: data.user.name })
          .remove()
            .then( result => console.log( result ) )
            .catch( err => console.log( err ) )

      } else {

        callback({ status: "err" })
      }
  })

  stream.on( "edit catalog", ( data, callback ) => {

      console.log(  )
      if ( data.method === "push" ) {

        new Product({
          product__type: data.product__type,
          product__name: data.product__name,
          product__cost: data.product__cost
        })
          .save()
            .then( obj => { console.log( obj ); callback({ status: "Ok" }) })
            .catch( err =>  console.log( err ) )
      }

      if ( data.method === "delete" ) {

      }
  })

})

www
  .use( router.routes() )
  .use( router.allowedMethods() )

http.listen( PORT, console.log( ` ^has been started, IP: ${ IP }, port: ${ PORT }` ) )
