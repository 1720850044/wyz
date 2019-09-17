import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const DEFAULT_LANG = 'zh';
const LOCALE_KEY = 'localeLanguage';

const locales = {
    zh: require('./zh_cn'),
    en: require('./en_us'),
    ja: require('./ja_jp'),
    ko: require('./ko_kr')
};

const i18n = new VueI18n({
    locale: DEFAULT_LANG,
    messages: locales
});

export const setup = lang => {
    if (lang === undefined) {
        lang = window.localStorage.getItem(LOCALE_KEY);
        if (locales[lang] === undefined) {
            lang = DEFAULT_LANG;
        }
    }
    window.localStorage.setItem(LOCALE_KEY, lang);
    Vue.config.lang = lang;
    i18n.locale = lang;
    console.log('LANGUAGE:', lang);
};

setup();
window.i18n = i18n;
export default i18n;
