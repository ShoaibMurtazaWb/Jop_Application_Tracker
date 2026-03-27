import mongoose, { Schema, Document } from "mongoose";

export interface iBoard extends Document {
    name: String;
    userId: String;
    columns: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const BoardSchema = new Schema<iBoard>({
    name:{
        type: String,
        required: true,  
    },
    userId:{
        type: String,
        required: true,
        index: true
    },
    columns:[
        {
            type: Schema.Types.ObjectId,
            ref: "Column",
        }
    ]
},{
    timestamps: true
})

export default mongoose.models.Board || mongoose.model<iBoard>("Board", BoardSchema)