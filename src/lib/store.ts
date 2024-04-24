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

class Store {
    private readonly dirPath: string

    constructor({ dirPath = STORE_DIR_PATH }:
        { dirPath?: string }
        = { dirPath: STORE_DIR_PATH }
    ) {
        console.log("In Store constrcutopr")
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

    public writeJsonFile<TFile extends JsonablePojo>(filePathInStoreDir: string, data: TFile) {
        const filePath = `${this.dirPath}/${filePathInStoreDir}`
        const destDir = path.dirname(filePath)
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true })
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), {})
    }
}

export {
    Store,
    ErrorFileNotExist
}
