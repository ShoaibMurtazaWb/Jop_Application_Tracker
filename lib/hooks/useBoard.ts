"use client"

import { useState } from "react";
import { Board, Column } from "../models/models.types";
import { STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR } from "next/dist/lib/constants";


export default function useBoard(initialBoard?: Board | null) {
    
    const [board, setBoard] = useState<Board | null>(initialBoard || null);
    const [columns, setColumns] = useState<Column[] | null>(initialBoard?.columns || null);
    const [error, setError] = useState<string | null>(null);

    function moveJob(jobApplicationId: string, newColumnsID: string, newOrder: number){}
    
    return{board, columns, error, moveJob}
}
