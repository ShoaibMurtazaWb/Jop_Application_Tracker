"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobApplication } from "../models";


interface JobApplicationData {
    company: string,
    position: string,
    location: string,
    notes?: string,
    salary?: string,
    jobUrl?: string,
    columnId: string,
    boardId: string,
    tags: string[],
    description: string,
}

export async function createJobApplication(data: JobApplicationData) {

    const session = await getSession()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    await connectDB()

    console.log("Data to create jobApplication: ", data)

    const {
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        tags,
        description,
    } = data;

    if (!company || !position || !columnId || !boardId) {
        return { error: "Missing required field(s)" }
    }

    // Verify board ownership
    const board = await Board.find({
        _id: boardId,
        userId: session.user.id
    })

    if (!board) {
        return { error: "Board not found" }
    }
    // Verify board ownership
    const column = await Column.find({
        _id: boardId,
        userId: session.user.id
    })

    if (!column) {
        return { error: "Column not found" }
    }

    const maxOrder = (await JobApplication.findOne({ columnId }).sort({ order: -1 }).select("order").lean()) as { order: number } || null;

    const jobApplication = await JobApplication.create({
        userId: session.user.id,
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        tags: tags || [],
        description,
        status: "applied",
        order: (maxOrder?.order ?? -1) + 1

    })

    await Column.findByIdAndUpdate(columnId, {
        $push: { jobApplications: jobApplication._id }
    });


    revalidatePath("/dashboard")

    return { data: JSON.parse(JSON.stringify(jobApplication)) }
}



export async function updateJobApplication(id: string, updates: {
    company?: string,
    position?: string,
    location?: string,
    notes?: string,
    salary?: string,
    jobUrl?: string,
    columnId?: string,
    order?: number,
    tags?: string[],
    description?: string,
}) {
    const session = await getSession()

    if (!session?.user) {
        return { error: "Unauthorized" }
    }

    const jobApplication = await JobApplication.findById(id);

    if(!jobApplication){
        return{error: "Job Application not found"}
    }

    if(jobApplication.userId !== session.user.id){
        return { error: "Unauthorized   "}
    }

    const { columnId, order, ...otherUpdates} = updates;

    const updatesToApply: Partial<{
        company?: string,
        position?: string,
        location?: string,
        notes?: string,
        salary?: string,
        jobUrl?: string,
        columnId?: string,
        order?: number,
        tags?: string[],
        description?: string,
    }> = otherUpdates;

    const currentColumnId = jobApplication.columnId.toString();
    
    const newColumnId = columnId?.toString();

    const isMovingToDifferentColumn = newColumnId && newColumnId !== currentColumnId;

    if(isMovingToDifferentColumn){
        await Column.findByIdAndUpdate(currentColumnId, {
            $pull: {jobApplications: id}
        })

        const jobsInTargetColumn = await jobApplication.find({
            columnId: newColumnId,
            _id: {$ne: id}
        }).sort({order: 1}).lean()


        let newOrderValue : number;

        if(order !== undefined && order !== null){
            newOrderValue = order * 100;

            const jobsThatNeedToShift = jobsInTargetColumn.slice(order);

            for (const job of jobsThatNeedToShift){
                await jobApplication.findByIdAndUpdate(job._id, {
                    $set: {order: job.order + 100}
                })
            }

        }else{
            if(jobsInTargetColumn.length > 0){
                const lastJobOrder = jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;
                newOrderValue = lastJobOrder + 100;
            }else{
                newOrderValue = 0;
            }
        }

        updatesToApply.columnId = newColumnId;
        updatesToApply.order = newOrderValue;

        await Column.findByIdAndUpdate(newColumnId, {
            $push: {jobApplications: id}
        })

    } else if(order !== undefined && order !== null){
        const otherJobsInColumn = await jobApplication.find({
            columnId: currentColumnId,
            _id: { $ne: id }
        }).sort({ order: 1 }).lean()

        const currentJobOrder = jobApplication.order || 0;
        const currentPositionIndex = otherJobsInColumn.findIndex(
            (job) => job.order > currentJobOrder
        );

        const oldPositionIndex = currentPositionIndex === -1 ? otherJobsInColumn.length : currentPositionIndex;

        const newOrderValue = order * 100;

        if(order < oldPositionIndex){
           const jobsToShiftDown = otherJobsInColumn.slice(order, oldPositionIndex);
           
           for(const job of jobsToShiftDown){
               await jobApplication.findByIdAndUpdate(job._id, {
                   $set: { order: job.order + 100 }
               })           
            }
        }else if(order > oldPositionIndex){
            const jobsToShiftDUp = otherJobsInColumn.slice(oldPositionIndex, order);

            for (const job of jobsToShiftDUp) {
                const newOrder = Math.max(0, job.order - 100);
                await jobApplication.findByIdAndUpdate(job._id, {
                    $set: { order: newOrder}
                })
            }
        }

        updatesToApply.order = newOrderValue;
    }

    const updated = await jobApplication.findByIdAndUpdate(id, updatesToApply, {
        new: true,
    })

    return {data: JSON.parse(JSON.stringify(updated))}
}