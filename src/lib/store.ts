import { STORE_DIR_PATH } from "../constants.js"
import fs from "fs"
import path from "path"

type JsonablePojo = {
    [key: string]: string | number | boolean | null | JsonablePojo | JsonablePojo[]
}

class ErrorFileNotExist extends Error {
    constructor(filePath: string) {
        super(`File does not exist: ${filePath}`)
    }
}

interface IStore {
    getDirPath(): string
    readJsonFile<TFile extends JsonablePojo>(filePathInStoreDir: string): TFile
    writeJsonFile<TFile extends JsonablePojo>(filePathInStoreDir: string, data: Partial<TFile>): void
}

class Store implements IStore {
    private readonly dirPath: string

    constructor({ dirPath = STORE_DIR_PATH }:
        { dirPath?: string }
        = { dirPath: STORE_DIR_PATH }
    ) {
        this.dirPath = dirPath
        if (!fs.existsSync(this.dirPath)) {
            fs.mkdirSync(this.dirPath, { recursive: true })
        }
    }

    public getDirPath() {
        return this.dirPath
    }

    public readJsonFile<TFile extends JsonablePojo>(filePathInStoreDir: string) {
        const filePath = `${this.dirPath}/${filePathInStoreDir}`
        if (!fs.existsSync(filePath)) {
            throw new ErrorFileNotExist(filePath)
        }
        const data = fs.readFileSync(filePath, "utf8")
        const file = JSON.parse(data) as TFile
        return file
    }

    /**
        * Write a JSON file to the store directory.
        * If the file already exists, the new data will be merged with the existing data.
     */
    public writeJsonFile<TFile extends JsonablePojo>(filePathInStoreDir: string, data: Partial<TFile>) {
        const filePath = `${this.dirPath}/${filePathInStoreDir}`
        const destDir = path.dirname(filePath)
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true })
        }
        let currFileData = {}
        if (fs.existsSync(filePath)) {
            currFileData = this.readJsonFile(filePathInStoreDir)
        }
        fs.writeFileSync(filePath, JSON.stringify({ ...currFileData, ...data }, null, 4), {})
    }
}

export {
    IStore,
    Store,
    ErrorFileNotExist
}
