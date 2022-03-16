const mongoose = require( "mongoose" )

mongoose
    .model(
        "catalog",
        new mongoose.Schema({
            product__type: {
                type: String,
                required: true
            },
            product__name: {
                type: String,
                required: true
            },
            product__cost: {
                type: String,
                required: true
            },
            product__img: {
                type: String,
                required: true
            }
        })
    )

mongoose
    .model(
        "orders",
        new mongoose.Schema({
            order__date: {
              type: String,
              required: true
            },
            full__name: {
                type: String,
                required: true
            },
            phone__number: {
                type: String,
                required: true
            },
            order: {
                type: String,
                required: true
            },
            delivery__method: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            branch__number__or__address: {
                type: String,
                required: true
            },
            comment: {
              type: String,
              required: false
            },
            // noreg | reg | submit | archive
            status: {
                type: String,
                required: true
            }
        })
    )

mongoose
    .model(
        "users",
        new mongoose.Schema({
            user: {
                type: String,
                required: true
            },
            key: {
                type: String,
                required: true
            },
            access__level: {
                type: String,
                required: false
            }
        })
    )
