import CartManager from "../DAO/fileManager/cart.service.js";
import Assert from "assert";
import dotenv from 'dotenv'
import mongoose from "mongoose";
dotenv.config()
const URL = process.env.URL


const assert = Assert.strict;

describe("testing", () => {
    before(function (done) {
        mongoose.connect(URL, {
            dbName: 'ecommerce'
        }).then(() => { console.log('DB connected'); done() })

        this.timeout(8000)
    })

    it('El dao debe poder obtener los carritos', async function () {
        const usersDao = new CartManager()
        const result = await usersDao.list()

        assert.strictEqual(Array.isArray(result), true)
    })

    after(function (done) {
        this.timeout(10000);

        mongoose.connection.close()
            .then(() => {
                console.log('DB disconnected');
                done();
            })
            .catch((err) => {
                console.error('Error disconnecting', err);
                done(err);
            });
    });
})