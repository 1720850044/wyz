
import upload from '../../views/chatInterface/upload.vue'
exports.install = ((Vue, options) => {
    Vue.component('uploader', upload)
})