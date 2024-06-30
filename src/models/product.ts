import {Schema, model} from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    image: string;
    stock: number;
}

const productSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    stock: {type: Number, required: true}
});

export const Product = model<IProduct>('Product', productSchema);
