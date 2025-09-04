import YoungChampion from './YoungChampion.mjs';

//ComiciViewer
export default class ComicRide extends YoungChampion {
    constructor() {
        super();
        super.id = 'kimicomi';
        super.label = 'キミコミ (KimiComi)';
        this.tags = ['manga', 'japanese'];
        this.url = 'https://kimicomi.com';
        this.apiUrl = this.url;
        this.links = {
            login: 'https://kimicomi.com/signin'
        };
    }
    async _getMangas() {
        let mangaList = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this._getMangasFromPage(page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }
}
