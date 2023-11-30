import mongoose from 'mongoose';

const UserModel = mongoose.model('users', new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['usuario', 'admin', 'premium'], // Definir los posibles roles
        default: 'usuario', // Establecer un valor predeterminado
    },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
    documents: [{
        name: String,
        reference: String,
    }],
    last_connection:  {
        type: String,
        default: ''
    },
}))

export default UserModel