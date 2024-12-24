import YoungChampion from './YoungChampion.mjs';

const mangaType = [
    "連載",
    "読み切り",
    "完結"
];
const jpDays = [
    "月",
    "火",
    "水",
    "木",
    "金",
    "土",
    "日"
];

const mangaPageList = mangaType.map(t => jpDays.map(d => `/category/manga?type=${encodeURI(t)}&day=${encodeURI(d)}`)).flat();
//ComiciViewer
export default class ComicPashNeo extends YoungChampion {
    constructor() {
        super();
        super.id = 'comicpash';
        super.label = 'Comic Pash';
        this.tags = ['manga', 'japanese'];
        this.url = 'https://comicpash.jp';
        this.apiUrl = this.url;
        this.links = {
            login: 'https://comicpash.jp/signin'
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
