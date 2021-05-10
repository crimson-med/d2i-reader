import { FileHandler } from '@argus-inc/fluct';
import { D2iLoader } from './../index';
const fs = new FileHandler();
const pathToData = fs.createPath(['data', 'i18n_fr.d2i'], false, true)


test('D2i has Loaded', async () => {
    const d2iTest = new D2iLoader(pathToData)
    const isLoaded = await d2iTest.loadFile()
    expect(isLoaded).toBe(true);
});

test('D2i has a record', async () => {
    const d2iTest = new D2iLoader(pathToData)
    const isLoaded = await d2iTest.loadFile()
    if (isLoaded) {
        expect(d2iTest.hasD2i(1)).toBe(true);
    }
});

test('D2i can get a record', async () => {
    const d2iTest = new D2iLoader(pathToData)
    const isLoaded = await d2iTest.loadFile()
    if (isLoaded) {
        const firstRecord = d2iTest.getD2i(1)
        if (firstRecord) {
            expect(firstRecord.id).toBe(1);
            expect(firstRecord.value).toBe(`Commerce de compte ou d'abonnement`)
        }

        //expect(d2iTest.getD2i(1)).toBe(D2iRecord);
    }
});