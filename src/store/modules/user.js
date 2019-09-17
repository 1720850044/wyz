import Cookies from 'js-cookie';

const user = {
    state: {
        secretKey:null
    },
    mutations: {
        logout (state, vm) {
            // console.log('user.js 正在退出');
            Cookies.remove('user');
            localStorage.removeItem('client_id');
            localStorage.removeItem('isjump');
            localStorage.removeItem('isproject');
            localStorage.removeItem('menuList');
            localStorage.removeItem('msgShow');
            localStorage.removeItem('projectNav');
            localStorage.removeItem('token');
            localStorage.removeItem('totalPermissions');
            localStorage.removeItem('userMsg');
            localStorage.removeItem('woroNav');
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
     		// 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
                localStorage.removeItem('client_id');
                localStorage.removeItem('isjump');
                localStorage.removeItem('isproject');
                localStorage.removeItem('menuList');
                localStorage.removeItem('msgShow');
                localStorage.removeItem('projectNav');
                localStorage.removeItem('token');
                localStorage.removeItem('totalPermissions');
                localStorage.removeItem('userMsg');
                localStorage.removeItem('woroNav');
            if (theme) {
                localStorage.theme = theme;
            }
        },
        getSecretKey(state,data){
            state.secretKey = data
        }
    },
    actions:{

    }
};

export default user;
