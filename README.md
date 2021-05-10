# d2i-reader

Simple typescript based d2i dofus reader

# usage

**async / await**

```ts
const d2iTest = new D2iLoader(pathToData)
const isLoaded = await d2iTest.loadFile()
if(isLoaded) {
    const d2iRec = d2iTest.get(1)
    console.dir(d2iRec)
}
```

**Promise**

```ts
const d2iTest = new D2iLoader(pathToData)
d2iTest.loadFile().then(isLoaded => {
    if(isLoaded) {
        const d2iRec = d2iTest.get(1)
        console.dir(d2iRec)
    }
}).catch(err => {
    console.log(err)
})
```

# d2iRecord

Using `D2iLoader.get` will return a D2iRecord of the following format:

```ts
{
    id: number
    value: string
    hasDiacritical: boolean
    valueDiacritical?: string
}
```

To check if the record exists you can use `D2iLoader.has` which will return a boolean

# d2iRecord

Here is a quick description of available information on a `D2iLoader class`

```ts
filePath: string // The path to the d2i file
fileBuffer: Buffer // File Buffer of the whole file (can be emptied after load)
filePointer: number // File pointer for parsing the d2i
d2i: D2i // The map of all D2iRecord loaded from the file
hasLoaded: boolean // Has the d2i finished loading
sizeData: number // Size of the d2iData
sizeIndex: number // Size of the d2iIndex
isLoading: boolean // if the data is being loaded
isD2iLoaded: boolean // if the d2i has finished being parsed
```

**`loadFile(autoLoad: boolean)`**

This will load all the chunks of the file to the buffer. autoLoad is set to true by default which means it will parse the d2i automatically through `processd2i`

**`getD2i(id: number)`**

Will return the current `D2iRecord` with the `id`

**`hasD2i(id: number)`**

Will return a boolean if a `D2iRecord` with the `id` exists