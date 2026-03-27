import connectDB from "./db";
import { Board, Column } from "@/lib/models";

export async function initializeUserBoard(userId: string) {

    const DEFAULT_COLUMNS = [
        { name: "Wish List", order: 0 },
        { name: "Applied", order: 1 },
        { name: "Interviewing", order: 2 },
        { name: "Offer", order: 3 },
        { name: "Rejected", order: 4 },
    ]

    try {
        await connectDB()

        // If Board already exists
        const existingBoard = await Board.findOne({
            userId: userId,
            name: "Job Hunt"
        })

        if (existingBoard) { return existingBoard }

        // Create the board
        const board = await Board.create({
            name: "Job Hunt",
            userId: userId,
            columns: []
        })

        // Create default columns
        const columns = await Promise.all(DEFAULT_COLUMNS.map((col) => Column.create({
            name: col.name,
            order: col.order,
            boardId: board._id,
            jobApplication: []
        })))

        // Update the board with new column IDs
        board.columns = columns.map((col) => col._id)
        await board.save();

    } catch (error) {
        throw (error)
    }
}