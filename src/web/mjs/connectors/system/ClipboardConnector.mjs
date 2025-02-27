/**
 * System
 * A special connector that allows to use manga links from the clipboard.
 * This connector does not implement the connector base class, because it operates different.
 */
export default class ClipboardConnector {

    /**
     *
     */
    constructor() {
        this.id = 'clipboard';
        this.label = ' 【Clipboard】';
        this.icon = '/img/connectors/' + this.id;
        this.tags = [];
        this.url = undefined;
        this.urlsByDomain = undefined;

        this.clipboard = require('electron').clipboard;
        this.mangaCache = [];
    }

    /**
     *
     */
    updateMangas(callback) {
        if (!this.isUpdating) {
            this.isUpdating = true;
            // this.setUrlsByDomain();
            this._getMangaList((_, mangas) => {
                this.mangaCache = mangas;
                this.isUpdating = false;
                this.getMangas(callback);
            });
        }
    }

    setUrlsByDomain() {
        let text = this.clipboard.readText();
        this.urlsByDomain = !text ? { "N/A": [] } : text.split(/\r?\n/)
            .reduce((acc, item) => {
                const key = new URL(item).hostname;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            }, {});
    }

    /**
     *
     */
    getMangas(callback) {
        callback(null, this.mangaCache);
    }

    /**
     *
     */
    async _getMangaList(callback) {
        let text = this.clipboard.readText();
        const connectorHits = {};
        let promises = !text ? [] : text.split(/\r?\n/).map(async line => {
            try {
                let uri = new URL(line);
                let connectors = Engine.Connectors.filter(connector => connector.canHandleURI && connector.canHandleURI(uri));
                if (!connectors.length) {
                    connectors = Engine.Connectors.filter(connector => connector.url && connector.url.includes(uri.hostname));
                }
                if (connectors.length > 1) {
                    connectors = connectors.filter(connector => uri.pathname.startsWith(new URL(connector.url).pathname));
                }
                if (!connectors.length) {
                    throw new Error('No matching connector found for URL ' + uri.href);
                }
                if (connectors.length > 1) {
                    throw new Error('To many matching connectors found for URL ' + uri.href);
                }
                if (uri.hostname in connectorHits) {
                    connectorHits[uri.hostname]++;
                    await new Promise(resolve => {
                        setTimeout(resolve, Math.random() * 8080 + 1337 * connectorHits[uri.hostname]);
                    });
                } else {
                    connectorHits[uri.hostname] = 1;
                }
                return await connectors[0].getMangaFromURI(uri);
            } catch (error) {
                console.warn('CLIPBOARD:', line, error);
                return null;
            }
        });
        Promise.all(promises)
            .then(mangas => callback(null, mangas.filter(Boolean)))
            .catch(error => callback(error, []));
    }
}