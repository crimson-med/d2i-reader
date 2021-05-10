import { D2i } from "./d2i"
import { createReadStream, ReadStream } from 'fs';
import { FileHandler } from '@argus-inc/fluct';
import { D2iRecord } from './D2iRecord';
const fs = new FileHandler();

export class D2iLoader {
    filePath: string
    fileBuffer: Buffer
    filePointer: number
    d2i: D2i
    hasLoaded: boolean
    sizeData: number
    sizeIndex: number
    isLoading: boolean
    isD2iLoaded: boolean
    constructor(filePath: string) {
        this.isLoading = true
        this.isD2iLoaded = false
        this.filePath = filePath
        this.fileBuffer = Buffer.from('')
        this.d2i = new Map()
        this.hasLoaded = false
        this.filePointer = 0
        this.sizeData = 0
        this.sizeIndex = 0
    }

    loadFile(autoLoad: boolean = true) {
        return new Promise<boolean>((resolve, reject) => {
            if (fs.exists(this.filePath)) {
                let readStream: ReadStream = createReadStream(this.filePath);
                const chunks: any[] = [];
                readStream.on('readable', () => {
                    let chunk;
                    while (null !== (chunk = readStream.read())) {
                        chunks.push(chunk);
                    }
                })
                readStream.on('error', (err) => {
                    console.error(err)
                    reject(false)
                })
                readStream.on('end', () => {
                    //const content = chunks.join('');
                    this.fileBuffer = Buffer.concat(chunks);
                    if (autoLoad) {
                        this.processd2i()
                        resolve(true)
                    } else {
                        resolve(true)
                    }
                });
            } else {
                reject(false)
                console.log(`SEOMTHING BROKE`)
            }
        })

    }

    processd2i() {
        this.sizeData = this.readInt()
        this.filePointer = this.sizeData
        this.sizeIndex = this.readInt()
        while (this.filePointer < this.sizeData + this.sizeIndex) {
            this.readD2iRecord()
        }
        // this.d2i.forEach((d2iRecord, key) => {
        //     console.log(`${key} ==> ${d2iRecord.value}`)
        // })
        if (this.d2i.size > 0) {
            this.isD2iLoaded = true
            this.fileBuffer = Buffer.from('')
        }
        this.isLoading = false
    }

    getD2i(id: number): undefined | D2iRecord {
        if (this.d2i.size > 0) {
            return this.d2i.get(id)
        }
        return undefined
    }

    hasD2i(id: number): boolean {
        if (this.d2i.size > 0) {
            return this.d2i.has(id)
        }
        return false
    }

    readBolean() {
        const data = this.fileBuffer.readUIntLE(this.filePointer, 1)
        this.filePointer += 1
        return (data === 1) ? true : false
    }

    readInt() {
        const data = this.fileBuffer.readUIntBE(this.filePointer, 4)
        this.filePointer += 4
        return data
    }

    readSize(position: number | null = null) {
        const pos = (position) ? position : this.filePointer
        const data = this.fileBuffer.readUIntBE(pos, 2)
        if (!position) this.filePointer += 2
        return data
    }

    readString(size: number, position: number | null = null) {
        const pos = (position) ? position : this.filePointer
        const data = this.fileBuffer.toString('utf-8', pos, size + pos)
        if (!position) this.filePointer += size
        return data
    }

    readD2iRecord() {
        const id = this.readInt()
        const hasDiacritical = this.readBolean()
        const valIdx = this.readInt()
        const valSize = this.readSize(valIdx)
        const val = this.readString(valSize, valIdx + 2)
        const newD2i: D2iRecord = {
            id,
            value: val,
            hasDiacritical,
        }
        if (hasDiacritical) {
            const diaIdx = this.readInt()
            const diaSize = this.readSize(diaIdx)
            const dia = this.readString(diaSize, diaIdx + 2)
            newD2i.valueDiacritical = dia
        }
        this.d2i.set(id, newD2i)
    }


}