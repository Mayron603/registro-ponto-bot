const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true,
        index: true
    },
    username: { 
        type: String, 
        required: true 
    },
    pontos: [
        {
            entrada: { 
                type: Date, 
                required: true 
            },
            saida: { 
                type: Date 
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Registro', registroSchema);